const { Sequelize } = require('sequelize');

const { config } = require('./../config/config');
const setupModels = require('./../db/models');

let dbUser;
let dbPassword;
let dbName;
let dbPort;

if (process.env.NODE_ENV === 'test') {
    dbUser = encodeURIComponent(config.dbTestUser);
    dbPassword = encodeURIComponent(config.dbTestPassword);
    dbName = config.dbTestName;
    dbPort = config.dbTestPort;
} else {
    dbUser = encodeURIComponent(config.dbUser);
    dbPassword = encodeURIComponent(config.dbPassword);
    dbName = config.dbName;
    dbPort = config.dbPort;
}

const URI = `postgres://${dbUser}:${dbPassword}@${config.dbHost}:${dbPort}/${dbName}`;

const sequelize = new Sequelize(URI, {
    dialect: 'postgres',
    logging: false,
});

setupModels(sequelize);

module.exports = { sequelize };