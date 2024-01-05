const express = require('express');
const passport = require('passport');

const UserService = require('../services/user.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler'); 
const { updateUserSchema, createUserSchema, getUserSchema, getUpdateUserSchema } = require('./../schemas/user.schema');

const router = express.Router();
const service = new UserService();

router.get('/',
    checkRoles('administrador', 'rector', 'coordinador'),
    async (req, res, next) => {
        try {
            const users = await service.find();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:id',
    checkRoles('administrador', 'rector', 'coordinador'),
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        const user = await service.findOne(id);
        res.json(user);
        } catch (error) {
        next(error);
        }
    }
);

router.post('/',
    checkRoles('administrador', 'rector', 'coordinador'),
    validatorHandler(createUserSchema, null, true),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const newUser = await service.create(body);
        res.status(201).json(newUser);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:id?',
    validatorHandler(getUpdateUserSchema, 'params'),
    validatorHandler(updateUserSchema, null, true),
    async (req, res, next) => {
        try {
        const idToken = req.user.sub;
        const idUser = req.params.id;
        const rol = req.user.role;
        const body = req.body || req.fields;
        const update = await service.updateUser(idToken, idUser, body, rol);
        res.json(update);
        } catch (error) {
        next(error);
        }
    }
);

router.delete('/:id',
    checkRoles('administrador', 'rector', 'coordinador'),
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        await service.delete(id);
        res.status(201).json({id});
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;