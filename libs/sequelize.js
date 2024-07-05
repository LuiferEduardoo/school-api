const { Sequelize } = require('sequelize');

const { config } = require('./../config/config');
const setupModels = require('./../db/models');

let sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:', // Utiliza SQLite en memoria para pruebas
        logging: false,
    });
} else {
    const USER = encodeURIComponent(config.dbUser);
    const PASSWORD = encodeURIComponent(config.dbPassword);
    const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

    sequelize = new Sequelize(URI, {
        dialect: 'postgres',
        logging: false,
    });
}

setupModels(sequelize);

module.exports = { sequelize };