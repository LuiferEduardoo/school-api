const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');

class RolService {
    constructor() {}

    async create(roleName) {
        let role = await sequelize.models.Rol.findOrCreate({ where: { rol: roleName } });
        return role[0]; // findOrCreate devuelve un arreglo con el resultado y un booleano indicando si fue creado o no
    }
}

module.exports = RolService;