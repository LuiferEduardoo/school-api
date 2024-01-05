const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const UserService = require('./user.service');
const service = new UserService();
const { signToken } = require('../libs/token-sing');
const { tokenVerify } = require('../libs/token-verify');
const { SendMain } = require('./emails.service');


class AuthService {
    async getUser(email, password){
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw boom.unauthorized('Email o contraseña incorrecta');
        }
        if (!user.active){
            throw boom.unauthorized('Usuario inactivo');
        }
        delete user.dataValues.password;
        const rta = {
            user,
            userRol: user.rol[0].rol
        }
        return rta;
    }
    signToken(user){
        const payload = {
            sub: user.user.id,
            role: user.userRol
        }
        const token = signToken(payload, '7d');
        return token;
    }
    async sendRecoveryPassword(email){
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.notFound();
        }
        const payload = {
            sub: user.id,
        }
        const token = signToken(payload, '15min');
        const contentHtml = `<p>Para recuperar tu contraseña ingresa atraves de este link: http://myfrontend.com/recovery?token=${token}</p>`;
        await service.update(user.id, { recoveryToken: token })
        await SendMain(user.email, 'Email para recuperar contraseña', '', contentHtml); 
        
        return {
            message: 'mail enviado'
        }
    }

    async changePassword(token, newPassword){
        try {
            const payload = tokenVerify(token);
            const user = await service.findOne(payload.sub);
            if ( user.recoveryToken !== token){
                throw boom.unauthorized();
            }
            const updatePassword = service.update(user.id, {
                recoveryToken: null,
                password: newPassword,
            })
            return {
                message: 'contraseña cambiada con exito'
            }

        } catch (error){
            throw boom.unauthorized();
        }
    }

}

module.exports = AuthService;