const { config } = require('./config');

const Redis = require('ioredis');


const redisConfig = {
    host: config.redisHost,
    port: config.redisPort,
    user: config.redisUser || null,
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
        await new Promise((resolve, reject) => {
            redis.get(accessToken, async (err, refreshToken) => {
                if (err) reject(err);
                if (refreshToken) {
                    const pipeline = redis.pipeline();
                    pipeline.del(accessToken);

                    redis.keys('*', async (err, keys) => {
                        if (err) reject(err);
                        if (keys && keys.length > 0) {
                            for (const key of keys) {
                                const storedRefreshToken = await redis.get(key);
                                if (storedRefreshToken === refreshToken) {
                                    pipeline.del(key);
                                }
                            }
                        }
                        
                        pipeline.del(refreshToken);
                        await pipeline.exec();
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getTokens,
    saveToken,
    verifyToken,
    deleteKeysStartingWith,
    deleteTokensDevice
}
