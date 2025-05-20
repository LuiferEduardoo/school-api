const authCombined = require('./authCombined.handler');

function checkIfThereIsToken() {
    return (req, res, next) => {
        if (!req.headers.authorization) {
            return next();  // Si no hay token en los headers, continúa sin autenticar
        }
        authCombined('access')(req, res, next);
    }
}

module.exports = checkIfThereIsToken;