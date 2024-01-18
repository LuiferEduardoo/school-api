const boom = require('@hapi/boom');
const ImageAssociation = require('./imageAssociation.service');

const bcrypt = require('bcrypt');
const { sequelize } = require('./../libs/sequelize');
const RolService = require('./rol.service');
const Transactional = require('./Transactional.service');
const { superAdmin } = require('../middlewares/auth.handler');
const { SendMain } = require('./emails.service'); 
const { getTokens, deleteTokensDevice, deleteKeysStartingWith } = require('./../config/redisConfigToken')
const Rol = new RolService(); 
const serviceImageAssociation = new ImageAssociation();

class UserService extends Transactional {
    async create(data) {
        return this.withTransaction(async (transaction) => {
            const newUser = await sequelize.models.User.create(data, { transaction });
            const role = await Rol.create(data.rol, { transaction });
            await newUser.addRol(role.id, { transaction });
            return 'Usuario creado exitosamente';
        })
    }
    async get (id, req){
        return this.withTransaction(async (transaction) => {
            const query = this.queryParameter(req.query);
            const attributes = { attributes: { exclude: ['recoveryToken', 'password']}}
            const include = [{association: 'rol'}, {association: 'image', include: [{association: 'image', include: 'file'}]}];
            if(id){
                return await this.getElementWithCondicional('User', include, {}, null, query, attributes);
            } 
            return await this.getAllElements('User', {}, include, null, query, attributes);
        });
    }

    async update(req, changes){
        async function validateUserChanges (req, changes, idUser, user, transaction) {
            let changesToUpdate = changes;
            if (!idUser) {
                await validateCurrentPassword(changesToUpdate, user, req);
                await serviceImageAssociation.update(req, 'ImageUser', {userId: req.user.sub}, changes.idNewImage, `profile/picture`, changes.idsImagesEliminate, changes.elimianteImage, transaction);
            } else if (superAdmin.includes(req.user.role)) {
                await handleSuperAdminChanges(changes, changesToUpdate, user);
            } else {
                throw boom.unauthorized();
            }
        }
        async function validateCurrentPassword(changesToUpdate, user, req) {
            if (changesToUpdate.currentPassword && changesToUpdate.password) {
                const passwordUser = user.password;
                const isMatch = await bcrypt.compare(changesToUpdate.currentPassword, passwordUser);
                if (!isMatch) {
                    throw boom.unauthorized('Contraseña incorrecta');
                }
                await SendMain(user.email, '¿Has cambiado la contraseña de tu cuenta?', 'changePassword', {name: user.name }); 
                await closeOtherDevices(changesToUpdate.closeOtherDevices, req)
            } else {
                delete changesToUpdate.password;
            }
        }
        async function handleSuperAdminChanges(changes, changesToUpdate, user) {
            if (changes.active !== null) {
                changesToUpdate = { active: changesToUpdate.active };
            }
            if (changes.rol !== user.rol[0].rol) {
                const role = await Rol.create(changes.rol);
                await user.setRol([role.id]);
                await deleteKeysStartingWith(`access${user.id}`);
            }
        }
        async function closeOtherDevices(isClose, req){
            if(isClose){
                const authHeader  = req.headers.authorization;
                const token = authHeader.split(' ')[1]; // Extraer solo el token eliminando 'Bearer '
                const tokensUser = await getTokens(`access${req.user.sub}`);
                const filteredTokens = tokensUser.filter((t) => t !== `access${req.user.sub}${token}`);
                for(const tokenAtDelete of filteredTokens){
                    await deleteTokensDevice(tokenAtDelete)
                }
            }
        }
        return this.withTransaction(async (transaction) => {
            const idUser = req.params.id;
            const id = idUser || req.user.sub; 
            const user = await this.getElementById(id, 'User', 'rol');
            await validateUserChanges(req, changes, idUser, user, transaction);
            await user.update(changes, { transaction });
            return { message: 'Usuario actualizado con éxito' };
        });
    }

    async delete(req, id, body) {
        return this.withTransaction(async (transaction) => {
            const user = await this.getElementById(id, 'User', [{association: 'rol'}, {association: 'image', include: [{association: 'image', include: 'file'}]}]);
            const idsImagesEliminate = user.image.map(image => (image.id));
            await serviceImageAssociation.delete(idsImagesEliminate, 'ImageUser', body.elimianteImage, req, transaction)
            await user.removeRol(user.rol[0].id, transaction)
            await user.destroy(transaction);
            return { id };
        });
    }
}

module.exports = UserService;