const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const { saveToken } = require('../config/redisConfigToken');
const ms = require('ms');

const timeToSeconds = (time) => {
    return ms(time) / 1000;
}

const signToken = async (payload, time, type, information) => {
    const jwtConfig = {
        expiresIn: time,
    };
    const jwtSecret = type === 'access' ? 'jwtSecretAccessToken' : type === 'refresh' ? 'jwtSecretRefreshToren' : type === 'recovery' ? 'jwtSecretRecoveryPassword' : null;
    if(!jwtSecret){
        throw new Error('Need a Jwt Secret')
    } else {
        const token = jwt.sign(payload, config[jwtSecret],  jwtConfig);
        const tokenInRedis = await saveToken(payload.sub, token, information, type, timeToSeconds(time)); // guardar el token en redis
        return token
    }
}

module.exports = { signToken };