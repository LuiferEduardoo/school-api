const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

function signToken(payload, time) {
    const jwtConfig = {
        expiresIn: time,
    };
    return jwt.sign(payload, config.jwtSecret,  jwtConfig);
}

module.exports = { signToken };