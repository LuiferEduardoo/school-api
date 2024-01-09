const boom = require('@hapi/boom');
const passport = require('passport');
const checkIfIsInRedis = require('./checkIfIsInRedis.handler');
const { checkSuperAdmin } = require('./auth.handler'); 

const authCombined = (type, isForSuperAdmin = false) => async (req, res, next) => {
    try {
        const jwt = type === 'access' ? 'jwt-access' : type === 'refresh' ? 'jwt-refresh' : null;
        passport.authenticate(jwt, {session: false})(req, res, async (error) => { // Verificamos si el token es valido
            if(error){
                return next(error);
            }
        });
        await checkIfIsInRedis(type)(req, res, async (error) => { // Verificamos que el token este guardo en redis
            if(error){
                return next(error);
            }
        });
        if(isForSuperAdmin){
            checkSuperAdmin()(req, res, async (error) => { // Verificamos si el rol pertenece a los superAdmin
                if(error){
                    return(next(error));
                }
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authCombined;