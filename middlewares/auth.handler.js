const boom = require('@hapi/boom');

const { config } = require('./../config/config');

function checkApiKey(req, res, next) {
    const apiKey = req.headers['api'];
    if (apiKey === config.apiKey) {
        next();
    } else {
        next(boom.unauthorized());
    }
}

const superAdmin = ['administrador', 'coordinador', 'rector'];

function checkSuperAdmin(){
    return (req, res, next) => {
        const user = req.user;
        if (superAdmin.includes(user.role)) {
        next();
        } else {
        next(boom.unauthorized());
        }
    }
}

module.exports = { checkSuperAdmin, superAdmin }