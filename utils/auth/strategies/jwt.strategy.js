const { Strategy, ExtractJwt } = require('passport-jwt');

const { config } = require('../../../config/config');
const boom = require('@hapi/boom');
const { verifyToken } = require('./../../../config/redisConfigToken');

const checkIfExistInRedis = async (type, req, user, done) => {
    const authHeader  = req.headers.authorization;
    const token = authHeader.split(' ')[1]; // Extraer solo el token eliminando 'Bearer '
    const verify = verifyToken(type, user, token);
    if(!verify){
        return done(null, false)
    }
};


const optionsForAccess = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretAccessToken,
    passReqToCallback: true
};

const optionsForRefresh = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretRefreshToren,
    passReqToCallback: true
};

const optionsForPasswordReset = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretRecoveryPassword,
    passReqToCallback: true
};

const JwtAccessStrategy = new Strategy(optionsForAccess, async(req, payload, done) => {
    await checkIfExistInRedis('access', req, payload.sub, done);
    return done(null, payload);
});

const JwtRefreshStrategy = new Strategy(optionsForRefresh, async (req, payload, done) => {
    await checkIfExistInRedis('refresh', req, payload.sub);
    return done(null, payload);
});

const JwtPasswordResetStrategy = new Strategy(optionsForPasswordReset, async (payload, done) => {
    return done(null, payload);
});

module.exports = {
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtPasswordResetStrategy
};