const express = require('express');
const authCombined = require('../middlewares/authCombined.handler');
const passport = require('passport');
const AuthService = require('../services/auth.service');
const validatorHandler = require('../middlewares/validator.handler');
const { login, recovery, changePassword } = require('./../schemas/auth.schema');


const router = express.Router();
const service = new AuthService();

router.post('/login',
    validatorHandler(login, null, true),
    passport.authenticate('local', {session: false}),
    async (req, res, next) => {
        try {
            const login = await service.login(req);
            res.json(login);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/token-access', 
    authCombined('refresh'),
    async (req, res, next) => {
        try {
            const tokenAccess = await service.returnTokenAccess(req);
            res.json(tokenAccess);
        } catch (error) {
            next(error);
        }
    }
)

router.post('/recovery',
    validatorHandler(recovery, null, true),
    async (req, res, next) => {
        try {
            const { email } = req.body || req.fields;
            const rta = await service.sendRecoveryPassword(email);
            res.json(rta);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/change-password',
    validatorHandler(changePassword, null, true),
    async (req, res, next) => {
        try {
            const { token, newPassword } = req.body || req.fields;
            const rta = await service.changePassword(token, newPassword);
            res.json(rta);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/log-out', 
    authCombined('access'),
    async (req, res, next) => {
        try {
            await service.logOut(req)
            res.json({
                message: 'Sesión cerrada con exito'
            })
        } catch (error) {
            next(error);
        }
    }
)

module.exports = router;