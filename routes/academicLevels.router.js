const express = require('express');
const authCombined = require('../middlewares/authCombined.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { getAcademicLevels, createAcademicLevels, updateAcademicLevels, deleteAcademicLevels, queryParameterUser } = require('../schemas/academicLevels.schema');
const { checkFiles } = require('../schemas/files.schema');

const AcademicLevels = require('../services/academicLevels.service');
const service = new AcademicLevels();
const router = express.Router();

router.get('/:id?',
    validatorHandler(queryParameterUser, 'query'),
    (req, res, next) => {
        if (!req.headers.authorization) {
            return next();  // Si no hay token en los headers, continúa sin autenticar
        }
        authCombined('access')(req, res, next)
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
    authCombined('access', true),
    validatorHandler(checkFiles, 'files.files'),
    validatorHandler(createAcademicLevels, null, true),
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

router.patch('/:id',
    authCombined('access', true),
    validatorHandler(getAcademicLevels, 'params'),
    validatorHandler(checkFiles, 'files.files'),
    validatorHandler(updateAcademicLevels, null, true),
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
    authCombined('access', true),
    validatorHandler(getAcademicLevels, 'params'),
    validatorHandler(deleteAcademicLevels, null, true),
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