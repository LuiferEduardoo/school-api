const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { config } = require('./../config/config')
const Transactional = require('./Transactional.service');
const { signToken } = require('../libs/token-sing');
const { tokenVerify } = require('../libs/token-verify');
const { SendMain } = require('./emails.service');
const { deleteKeysStartingWith, deleteTokensDevice } = require('./../config/redisConfigToken')


class AuthService extends Transactional{
    async authenticationUser(credential, password){
        const where = {};
        if (credential.includes('@')) {
            where.email = credential;
        } else {
            where.username = credential;
        }
        const user = await this.getElementWithCondicional('User', 'rol', where, null, {}, {}, 'unauthorized', 'Contraseña o correo incorrecto');
        try {
            const checkPassword = await bcrypt.compare(password, user.password);
            if(!checkPassword){
                throw boom.unauthorized('Contraseña o correo incorrecto');
            }
            if (!user.active){
                throw boom.unauthorized('Usuario inactivo');
            }
            delete user.dataValues.password;
            return user
        } catch (error) {
            throw error;
        }
    }
    async tokenAccess(user, refreshToken){
        try {
            const payload = {
                sub: user.id,
                role: user.rol[0].rol
            }
            return await signToken(payload, '8h', 'access', refreshToken);
        } catch (error) {
            throw error
        }
    }
    async login(req){
        try {
            const user = req.user 
            const tokenRefresh = await signToken({ sub: user.id }, '180d', 'refresh'); // Generamos el refresh token
            const tokenAccess = await this.tokenAccess(user, `refresh${user.id}${tokenRefresh}`); // Generamos el access token
            return {
                message: 'Inicio de sesión exitoso',
                tokenAccess: {token: tokenAccess, expiresIn: '8h'},
                tokenRefresh: {token: tokenRefresh, expiresIn: '180d'}
            };
        } catch (error) {
            throw error
        }
    }
    async logOut(req){
        try {
            const tokenAccessInformation = req.user;
            const authHeader = req.headers.authorization;
            const tokenAccess = authHeader.split(' ')[1]; // Extraer solo el token eliminando 'Bearer '
            await deleteTokensDevice(`access${tokenAccessInformation.sub}${tokenAccess}`) // se eliminan los tokens por medio del access token
        } catch(error){
            throw error
        }
    }
    async returnTokenAccess(req){
        try{
            const tokenRefreshInformation = req.user; // Traemos la información de token
            const authHeader = req.headers.authorization;
            const tokenRefresh = authHeader.split(' ')[1]; // Extraer solo el token eliminando 'Bearer '
            const user = await this.getElementById(tokenRefreshInformation.sub, 'User', 'rol');
            const token = await this.tokenAccess(user, `refresh${user.id}${tokenRefresh}`) // generamos el access token
            return {
                message: 'Token creado con exito',
                tokenAccess: {token, expiresIn: '8h'},
            };
        } catch(error){
            throw error
        }
    }
    async sendRecoveryPassword(email){
        try {
            const user = await this.getElementWithCondicional('User', [], {email: email});
            const token = await signToken({ sub: user.id }, '25min', 'recovery');
            await user.update({ recoveryToken: token });
            await SendMain(user.email, '¿Has solicitado un cambio de contraseña en su cuenta?', 'recoveryPassword', {name: user.name, linkRecoveryPassword: `${config.frontendUrl}/auth/change-password?token=${token}` }); 
            return {
                message: 'mail enviado'
            }
        } catch (error) {
            return {
                message: 'mail enviado'
            }
        }
    }

    async changePassword(token, newPassword){
        return this.withTransaction(async (transaction) => {
            const payload = tokenVerify(token, 'jwtSecretRecoveryPassword');
            const user = await this.getElementById(payload.sub, 'User');
            if ( user.recoveryToken !== token){
                throw boom.unauthorized();
            }
            await user.update({
                recoveryToken: null,
                password: newPassword
            }, {transaction})
            await deleteKeysStartingWith(`access${user.id}`);
            await deleteKeysStartingWith(`refresh${user.id}`);
            await SendMain(user.email, '¿Has cambiado la contraseña de tu cuenta?', 'changePassword', {name: user.name }); 
            return {
                message: 'Contraseña cambiada con exito'
            }
        });
    }
}

module.exports = AuthService;