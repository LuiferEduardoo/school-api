const express = require('express');
const passport = require('passport');
const { checkSuperAdmin } = require('../middlewares/auth.handler'); 
const validatorHandler = require('../middlewares/validator.handler');
const { getCalendar, createCalendar, updateCalendar } = require('../schemas/calendar.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const Calendar = require('../services/calendar.service');
const service = new Calendar();
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
            const getCalendarReturn = await service.get(req, id);
            res.status(200).json(getCalendarReturn);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/',
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
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
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
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
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
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