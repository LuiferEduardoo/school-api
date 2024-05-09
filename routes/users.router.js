const express = require('express');

const UserService = require('../services/user.service');
const validatorHandler = require('../middlewares/validator.handler');
const { updateUserSchema, createUserSchema, deleteUserSchema, getUserSchema, getUpdateUserSchema, queryParameterUser } = require('./../schemas/user.schema');
const { checkFiles } = require('../schemas/files.schema');
const authCombined = require('../middlewares/authCombined.handler');

const router = express.Router();
const service = new UserService();

const userRoute = express.Router();


router.get('/users/:id?',
    authCombined('access', true),
    validatorHandler(queryParameterUser, 'query'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const users = await service.getUsers(id, req);
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
);
userRoute.get('', 
    async (req, res, next) => {
        try {
            const users = await service.getUser(req);
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
);
userRoute.post('',
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

userRoute.patch('/:id?',
    (req, res, next) => {
        if (!req.params.id) {
            return next();  // Si no hay token en los headers, continúa sin autenticar
        }
        authCombined('access', true)(req, res, next);
    },
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

userRoute.delete('/:id',
    authCombined('access', true),
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(deleteUserSchema, null, true),
    async (req, res, next) => {
        try {
        const { id } = req.params;
        const body = req.body || req.fields;
        await service.delete(req, id, body);
        res.status(200).json({id});
        } catch (error) {
        next(error);
        }
    }
);

router.use('/user', userRoute);

module.exports = router;