const { Strategy, ExtractJwt } = require('passport-jwt');

const { config } = require('../../../config/config');

const optionsForAccess = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretAccessToken
};

const optionsForRefresh = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretRefreshToren
};

const optionsForPasswordReset = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecretRecoveryPassword
};

const JwtAccessStrategy = new Strategy(optionsForAccess, (payload, done) => {
    return done(null, payload);
});

const JwtRefreshStrategy = new Strategy(optionsForRefresh, (payload, done) => {
    return done(null, payload);
});

const JwtPasswordResetStrategy = new Strategy(optionsForPasswordReset, (payload, done) => {
    return done(null, payload);
});

module.exports = {
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtPasswordResetStrategy
};