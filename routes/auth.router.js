const express = require('express');
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
            const user = req.user;
            const token = service.signToken(user);
            res.json({
                ...user,
                token: token,
            });
        } catch (error) {
            next(error);
        }
    }
);

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

module.exports = router;