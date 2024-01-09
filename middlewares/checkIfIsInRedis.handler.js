const boom = require('@hapi/boom');
const { verifyToken } = require('./../config/redisConfigToken');

const checkIfIsInRedis = (type) => async (req, res, next) => {
    const authHeader  = req.headers.authorization;
    const token = authHeader.split(' ')[1]; // Extraer solo el token eliminando 'Bearer '
    const verifyInRedis = await verifyToken(type, req.user.sub, token);
    if (!verifyInRedis) {
        next(boom.unauthorized());
    }
    next();
};

module.exports = checkIfIsInRedis;