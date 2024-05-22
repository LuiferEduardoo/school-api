const express = require('express');
const authCombined = require('../middlewares/authCombined.handler');
const checkIfThereIsToken = require('../middlewares/checkIfThereIsToken.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { getCalendar, createCalendar, updateCalendar } = require('../schemas/calendar.schema');

const Calendar = require('../services/calendar.service');
const service = new Calendar();
const router = express.Router();

router.get('/:id?',
    checkIfThereIsToken(),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const getCalendarReturn = await service.get(req, id);
            res.status(200).json(getCalendarReturn);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/',
    authCombined('access', true),
    validatorHandler(createCalendar, null, true),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const newCalendar = await service.create(body);
        res.status(201).json(newCalendar);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:id?',
    authCombined('access', true),
    validatorHandler(getCalendar, 'params'),
    validatorHandler(updateCalendar, null, true),
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
    authCombined('access', true),
    validatorHandler(getCalendar, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleteCalendar = await service.delete(id);
            res.status(200).json(deleteCalendar);
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;