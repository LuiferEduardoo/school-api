const express = require('express'); 
const authCombined = require('../middlewares/authCombined.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { getSchedule, createSchedule, updateSchedule } = require('../schemas/schedule.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const Schedule = require('../services/schedule.service');
const service = new Schedule();
const router = express.Router();

router.get('/:grade/:course?',
    validatorHandler(queryParamets, 'query'),
    async (req, res, next) => {
        try {
            const getScheduleReturn = await service.get(req);
            res.status(200).json(getScheduleReturn);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/',
    authCombined('access', true),
    validatorHandler(createSchedule, null, true),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const newSchedule = await service.create(body);
            res.status(201).json(newSchedule);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:id?',
    authCombined('access', true),
    validatorHandler(getSchedule, 'params'),
    validatorHandler(updateSchedule, null, true),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id } = req.params
            const update = await service.update(id, body);
            res.json('Horario actualizado con exito');
        } catch (error) {
        next(error);
        }
    }
);

router.delete('/:id',
    authCombined('access', true),
    validatorHandler(getSchedule, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleteSchedule = await service.delete(id);
            res.status(200).json({message: 'Horario borrado con exito', id: id });
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;