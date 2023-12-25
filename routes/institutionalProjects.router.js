const express = require('express');
const passport = require('passport');

const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler'); 
const { createInstitutionalProjects, updateInstitutionalProjects } = require('../schemas/institutionalProjects.schema');

const InstitutionalProjects = require('../services/institutionalProjects.service');
const service = new InstitutionalProjects();
const router = express.Router();

// router.get('/:id?',
//     async (req, res, next) => {
//         try {
//             const { id } = req.params;
//             const getNewsPublications = await service.get(id);
//             res.status(200).json(getNewsPublications);
//         } catch (error) {
//         next(error);
//         }
//     }
// );
router.post('/',
    passport.authenticate('jwt', {session: false}), 
    validatorHandler(createInstitutionalProjects, 'fields'),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const newInstitutionalProjects = await service.create(req, body);
        res.status(201).json(newInstitutionalProjects);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:id',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(updateInstitutionalProjects, 'fields'),
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
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id } = req.params;
            const institutionalProjects = await service.delete(req, body, id);
            res.status(200).json(institutionalProjects);
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;