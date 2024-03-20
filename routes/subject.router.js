const express = require('express'); 
const validatorHandler = require('../middlewares/validator.handler');
const { getSubject, createSubject, updateSubject, parameterSubject, queryParameterSubject } = require('../schemas/subject.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const Subject = require('../services/subject.service');
const service = new Subject();
const router = express.Router();

router.get('/:academicLevelId/:id?',
    validatorHandler(queryParameterSubject, 'query'),
    validatorHandler(getSubject, 'params'),
    async (req, res, next) => {
        try {
            const { academicLevelId, id } = req.params;
            const getSubject = await service.get(req, id, academicLevelId);
            res.status(200).json(getSubject);
        } catch (error) {
            next(error);
        }
    }
);
router.post('/:academicLevelId',
    validatorHandler(createSubject, null, true),
    validatorHandler(parameterSubject, 'params'),
    async (req, res, next) => {
        try {
            const { academicLevelId } = req.params;
            const body = req.body || req.fields;
            const newSubjet = await service.create(body, academicLevelId);
            res.status(201).json(newSubjet);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:id',
    validatorHandler(getSubject, 'params'),
    validatorHandler(updateSubject, null, true),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id } = req.params
            const update = await service.update(body, id);
        res.json(update);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id',
    validatorHandler(getSubject, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleteSubject = await service.delete(id);
            res.status(200).json(deleteSubject);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;