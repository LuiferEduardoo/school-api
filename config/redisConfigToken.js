const { config } = require('./config');

const Redis = require('ioredis');


const redisConfig = {
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword || null
};
const redis = new Redis(redisConfig); // Esto conecta con un servidor Redis local por defecto


// Almacena un Access Token en Redis con un tiempo de vida (ejemplo de 1 hora)
const saveToken = async (userId, token, information, type, expired) => {
    await redis.set(`${type}${userId}${token}`, information, 'EX', expired); // 'EX' establece el tiempo de vida en segundos
}

const verifyToken = async (type, userId, token) =>{
    return await redis.exists(`${type}${userId}${token}`).then((result) => {
        if(result === 1){
            return true
        } return false
    })
} 
const getTokens = async (pattern) => {
    return await redis.keys(`${pattern}*`);
}

const deleteKeysStartingWith = async (pattern) => {
    const keysToDelete = await redis.keys(`${pattern}*`);
    if (keysToDelete.length > 0) {
        const pipeline = redis.pipeline(); // Utilizamos pipeline para ejecutar las operaciones en lote
        keysToDelete.forEach(key => {
            pipeline.del(key);
        });
        await pipeline.exec();
    }
}

const deleteTokensDevice = async (accessToken) => {
    try {
        redis.get(accessToken, (err, refreshToken) => {
            if(refreshToken){
                const multi = redis.multi();
                multi.del(accessToken);
                if(redis.keys(refreshToken)){
                    multi.del(refreshToken);
                }
                multi.exec();
            }
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getTokens,
    saveToken,
    verifyToken,
    deleteKeysStartingWith,
    deleteTokensDevice
}
