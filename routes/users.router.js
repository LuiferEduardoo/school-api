const express = require('express');
const passport = require('passport');

const UserService = require('../services/user.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkSuperAdmin } = require('../middlewares/auth.handler'); 
const { updateUserSchema, createUserSchema, deleteUserSchema, getUserSchema, getUpdateUserSchema } = require('./../schemas/user.schema');
const { checkFiles } = require('../schemas/files.schema');

const router = express.Router();
const service = new UserService();

router.get('/:id?',
    checkSuperAdmin(),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const users = await service.get(id, req);
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/',
    checkSuperAdmin(),
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
    validatorHandler(checkFiles, 'files.files'),
    validatorHandler(updateUserSchema, null, true),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const update = await service.update(req, body);
        res.json(update);
        } catch (error) {
        next(error);
        }
    }
);

router.delete('/:id',
    checkSuperAdmin(),
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(deleteUserSchema, null, true),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        const body = req.body || req.fields;
        await service.delete(req, id, body);
        res.status(201).json({id});
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;