const express = require('express');
const passport = require('passport');

const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler'); 
const { getNewsPublications, createNewsPublication, updateNewsPublication } = require('../schemas/newsPublication.schema');

const News = require('../services/news.service');
const service = new News();
const router = express.Router();

router.get('/:id?',
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const getNewsPublications = await service.get(id);
            res.status(200).json(getNewsPublications);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/',
    passport.authenticate('jwt', {session: false}), 
    checkRoles('administrador', 'rector', 'coordinador'),
    validatorHandler(createNewsPublication, null, true),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const newNewsPublication = await service.create(req, body);
        res.status(201).json(newNewsPublication);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:id?',
    passport.authenticate('jwt', {session: false}),
    checkRoles('administrador', 'rector', 'coordinador'), 
    validatorHandler(getNewsPublications, 'params'),
    validatorHandler(updateNewsPublication, null, true),
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
    checkRoles('administrador', 'rector', 'coordinador'),
    validatorHandler(getNewsPublications, 'params'),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id } = req.params;
            await service.delete(id, body, req);
            res.status(200).json({id});
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;