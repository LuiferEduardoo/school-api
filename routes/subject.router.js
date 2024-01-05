const express = require('express'); 
const validatorHandler = require('../middlewares/validator.handler');
const { getSubject, createSubject, updateSubject } = require('../schemas/subject.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const Subject = require('../services/subject.service');
const service = new Subject();
const router = express.Router();

router.get('/:id?',
    validatorHandler(queryParamets, 'query'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const getSubject = await service.get(req, id);
            res.status(200).json(getSubject);
        } catch (error) {
            next(error);
        }
    }
);
router.post('/',
    validatorHandler(createSubject, null, true),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const newSubjet = await service.create(body);
            res.status(201).json(newSubjet);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:id?',
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