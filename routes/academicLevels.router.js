const express = require('express');
const passport = require('passport');
const { checkSuperAdmin } = require('../middlewares/auth.handler'); 
const validatorHandler = require('../middlewares/validator.handler');
const { getAcademicLevels, createAcademicLevels, updateAcademicLevels } = require('../schemas/academicLevels.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const AcademicLevels = require('../services/academicLevels.service');
const service = new AcademicLevels();
const router = express.Router();

router.get('/:id?',
    validatorHandler(queryParamets, 'query'),
    (req, res, next) => {
        if (!req.headers.authorization) {
            return next();  // Si no hay token en los headers, continúa sin autenticar
        }
        passport.authenticate('jwt', { session: false })(req, res, next);
    },
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const getAcademicLevels = await service.get(req, id);
            res.status(200).json(getAcademicLevels);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/',
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
    validatorHandler(createAcademicLevels, 'fields'),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const newAcademicLevels = await service.create(req, body);
        res.status(201).json(newAcademicLevels);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:id?',
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
    validatorHandler(getAcademicLevels, 'params'),
    validatorHandler(updateAcademicLevels, 'fields'),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const { id } = req.params
        const update = await service.update(req, body, id);
        res.json(update);
        } catch (error) {
        next(error);
        }
    }
);

router.delete('/:id',
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
    validatorHandler(getAcademicLevels, 'params'),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id } = req.params;
            const deleteAcademicLeveles = await service.delete(id, body, req);
            res.status(200).json(deleteAcademicLeveles);
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;