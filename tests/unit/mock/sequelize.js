const setupModels = require('../../../db/models');
const { Sequelize } = require('sequelize');

// Crear una instancia de Sequelize para pruebas con SQLite en memoria
const sequelizeTest = new Sequelize('sqlite::memory:', {
    dialect: 'sqlite',
    logging: false,
});

setupModels(sequelizeTest);

module.exports = { sequelize: sequelizeTest };
