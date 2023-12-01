const boom = require('@hapi/boom');

const bcrypt = require('bcrypt');
const { sequelize } = require('./../libs/sequelize');
const RolService = require('./rol.service');
const Transactional = require('./Transactional.service');

const Rol = new RolService(); 

class UserService extends Transactional {
    async create(data) {
        return this.withTransaction(async (transaction) => {
            const newUser = await sequelize.models.User.create(data, { transaction });
            const role = await Rol.create(data.rol, { transaction });
            await newUser.addRol(role.id, { transaction });
            return 'Usuario creado exitosamente';
        })
    }

    async find() {
        const users = await sequelize.models.User.findAll({
            include: 'rol',
        });
        return users;
    }

    async findOne(id) {
        const user = await sequelize.models.User.findOne({
            where: { id },
            include: 'rol',
        });
    
        if (!user) {
            throw boom.notFound('User not found');
        }
    
        return user;
    }

    async findByEmail(email){
        const rta = await sequelize.models.User.findOne({
            where: { email },
            include: 'rol',
        });
        return rta;
    }

    async checkPassword(id, password){
        const user = await this.findOne(id);
        const passwordUser = user.password;
        const isMatch = await bcrypt.compare(password, passwordUser);
        if(!isMatch){
            throw boom.unauthorized('Contraseña incorrecta');
        }
    }

    async update(id, changes) {
        return this.withTransaction(async (transaction) => {
            if(Object.keys(changes).length === 0){
                throw boom.badRequest('No ha mandado cambios');
            }
            const user = await this.findOne(id);
            const rta = await user.update(changes, { transaction });
            return rta;
        });
    }
    async updateRol(id, rol){
        const user = await this.findOne(id);
        if(rol !== user.rol[0].rol){
            const role = await Rol.create(rol);
            await user.setRol([role.id]);
        }
    }
    async updateUser(idToken, idUser, changes, rol){
        let id; 
        let changesToUpdate = changes; 
        if(!idUser){
            id = idToken; 
            if(changesToUpdate.currentPassword && changesToUpdate.password){
                await this.checkPassword(id, changesToUpdate.currentPassword);
            } else{
                delete changesToUpdate.password;
            } 
        } else if(rol == 'administrador' || rol == "rector" || rol == "coordinador" ) {
            id = idUser;
            if(changes.active !== null){
                changesToUpdate = { active: changesToUpdate.active };
            }
            await this.updateRol(id, changes.rol);
        } else{
            throw boom.unauthorized();
        }
        const rta = await this.update(id, changesToUpdate);
        return rta;
    }

    async delete(id) {
        return this.withTransaction(async (transaction) => {
            const user = await this.findOne(id);
            await user.removeRol(user.rol[0].id, transaction)
            await user.destroy(transaction);
            return { id };
        });
    }
}

module.exports = UserService;