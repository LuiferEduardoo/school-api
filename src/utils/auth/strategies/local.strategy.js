const { Strategy } = require('passport-local');

const AuthService = require('../../../services/auth.service');
const service = new AuthService();

const LocalStrategy = new Strategy({
    usernameField: 'credential',
    passwordField: 'password'
    },
    async (credential, password, done) => {
        try {
            const user = await service.authenticationUser(credential, password);
            done(null, user);
        } catch (error) {
        done(error, false);
        }
    }
);

module.exports = LocalStrategy;