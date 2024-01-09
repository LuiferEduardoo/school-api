const express = require('express');
const authCombined = require('../middlewares/authCombined.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { getAdmissionRequest, createAdmissionRequest, updateAdmissionRequest } = require('../schemas/admissionRequest.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const AdmissionRequest = require('../services/admissionRequest.service');
const service = new AdmissionRequest();
const router = express.Router();

router.get('/status/:numberDocument',
    async (req, res, next) => {
        try {
            const { numberDocument } = req.params;
            const getAdmissionRequestReturn = await service.getStatus(numberDocument);
            res.status(200).json(getAdmissionRequestReturn);
        } catch (error) {
        next(error);
        }
    }
);

router.get('/request/:id?',
    authCombined('access', true),
    validatorHandler(queryParamets, 'query'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const getAdmissionRequestReturn = await service.get(req, id);
            res.status(200).json(getAdmissionRequestReturn);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/request',
    validatorHandler(createAdmissionRequest, null, true),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const newAdmissionRequest = await service.create(body);
        res.status(201).json(newAdmissionRequest);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/request/:id',
    authCombined('access', true),
    validatorHandler(getAdmissionRequest, 'params'),
    validatorHandler(updateAdmissionRequest, null, true),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const { id } = req.params
        const update = await service.update(id, body);
        res.json(update);
        } catch (error) {
        next(error);
        }
    }
);

router.delete('/request/:id',
    authCombined('access', true),
    validatorHandler(getAdmissionRequest, 'params'),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id } = req.params;
            const deleteAdmissionRequest = await service.delete(id);
            res.status(200).json(deleteAdmissionRequest);
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;