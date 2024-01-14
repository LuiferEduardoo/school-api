const passport = require('passport');
const { checkSuperAdmin } = require('./auth.handler');
const boom = require('@hapi/boom');

const authCombined = (type, isForSuperAdmin = false) => async (req, res, next) => {
    try {
        const jwt = type === 'access' ? 'jwt-access' : type === 'refresh' ? 'jwt-refresh' : null;

        // Utilizamos promisify para convertir la función en Passport a una función que devuelve una Promesa
        const passportAuthenticateAsync = (req, res) => {
            return new Promise((resolve, reject) => {
                passport.authenticate(jwt, { session: false })(req, res, (error) => {
                    if (error) {
                        reject(boom.conflict());
                    } else {
                        resolve();
                    }
                });
            });
        };
        await passportAuthenticateAsync(req, res);

        if (isForSuperAdmin) {
            checkSuperAdmin()(req, res, (error) => {
                if (error) {
                    next(error);
                }
            });
        }

        next();
    } catch (error) {
        next(error)
    }
};

module.exports = authCombined;