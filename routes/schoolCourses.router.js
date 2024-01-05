const express = require('express'); 
const validatorHandler = require('../middlewares/validator.handler');
const { getSchoolCourses, createSchoolCourses, updateSchoolCourses } = require('../schemas/schoolCourses.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const SchoolCourses = require('../services/schoolCourses.service');
const service = new SchoolCourses();
const router = express.Router();

router.get('/:id?',
    validatorHandler(queryParamets, 'query'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const getSchoolCoursesToReturn = await service.get(req, id);
            res.status(200).json(getSchoolCoursesToReturn);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/',
    validatorHandler(createSchoolCourses, null, true),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const newSchoolCourses = await service.create(body);
            res.status(201).json(newSchoolCourses);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:id?',
    validatorHandler(getSchoolCourses, 'params'),
    validatorHandler(updateSchoolCourses, null, true),
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

router.delete('/:id',
    validatorHandler(getSchoolCourses, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleteSchoolCourses = await service.delete(id);
            res.status(200).json(deleteSchoolCourses);
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;