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
    async handleGetUser (id, req) {
        return this.withTransaction(async (transaction) => {
            const attributes = { attributes: { exclude: ['recoveryToken', 'password']}}
            const include = [{association: 'rol'}, {association: 'image', include: [{association: 'image', include: 'file'}]}];
            if(id){
                return await this.getElementWithCondicional('User', include, {id: id}, null, null, attributes);
            }
            const query = this.queryParameterPagination(req.query);
            const { search, active, rol} = req.query;
            const whereClause = {};
            const dataFilter= ['name', 'lastName', 'username', 'email'];
            this.querySearch(dataFilter, search, whereClause);

            if (active) {
                whereClause.active = active;
            }

            if (rol) {
                whereClause['$rol.rol$'] = rol;
            }
            return await this.getAllElements('User', whereClause, include, null, query, attributes);
        });
    }
    async create(data) {
        return this.withTransaction(async (transaction) => {
            const newUser = await sequelize.models.User.create(data, { transaction });
            const role = await Rol.create(data.rol, { transaction });
            await newUser.addRol(role.id, { transaction });
            return 'Usuario creado exitosamente';
        })
    }
    async getUser (req){
        const idUser = req.user.sub
        return this.handleGetUser(idUser, req)
    }
    async getUsers (id, req){
        return await this.handleGetUser(id, req);
    }

    async update(req, changes){
        let changesToUpdate = changes
        async function validateUserChanges (req, changes, idUser, user, transaction) {
            if (!idUser) {
                await validateCurrentPassword(changesToUpdate, user, req);
                if(!user.image?.[0]?.imageId && (req?.files?.files || changes.idNewImage)){
                    await serviceImageAssociation.createOrAdd(req, 'ImageUser', {userId: req.user.sub}, `profile/picture`, changes.idNewImage, transaction, true);
                } else {
                    await serviceImageAssociation.updateInDataBase(req, 'ImageUser', user.image?.[0]?.imageId, changes.idNewImage, `profile/picture` ,transaction);
                }
                delete changesToUpdate.active;
            } else if (superAdmin.includes(req.user.role)) {
                delete changesToUpdate.name;
                delete changesToUpdate.lastName;
                delete changesToUpdate.username;
                delete changesToUpdate.password;
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
                    throw boom.badData('Contraseña incorrecta');
                }
                await SendMain(user.email, '¿Has cambiado la contraseña de tu cuenta?', 'changePassword', {name: user.name }); 
                await closeOtherDevices(changesToUpdate.closeOtherDevices, req)
            } else {
                delete changesToUpdate.password;
            }
        }
        async function handleSuperAdminChanges(changes, changesToUpdate, user) {
            if((changes.active !== null) || (changes.rol)){
                if (changes.rol && changes.rol !== user.rol[0].rol) {
                    const role = await Rol.create(changes.rol);
                    await user.setRol([role.id]);
                }
                await deleteKeysStartingWith(`access${user.id}`);
                await deleteKeysStartingWith(`refresh${user.id}`);
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
            const user = await this.getElementById(id, 'User', ['rol', 'image']);
            await validateUserChanges(req, changes, idUser, user, transaction);
            await user.update(changesToUpdate, { transaction });
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
            await deleteKeysStartingWith(`access${id}`);
                await deleteKeysStartingWith(`refresh${id}`);
            return { id };
        });
    }
}

module.exports = UserService;