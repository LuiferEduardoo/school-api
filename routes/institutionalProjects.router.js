const express = require('express');

const authCombined = require('../middlewares/authCombined.handler');
const checkIfThereIsToken = require('../middlewares/checkIfThereIsToken.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { createInstitutionalProjects, updateInstitutionalProjects, queryInstitutionalProjects } = require('../schemas/institutionalProjects.schema');
const { createInstitutionalProjectsPublicationns, updateInstitutionalProjectsPublicationns, deleInstitutionalProjectsPublications, queryInstitutionalProjectsPublications } = require('../schemas/institutionalProjectsPublications.schema');
const { checkFiles } = require('../schemas/files.schema');

const InstitutionalProjects = require('../services/institutionalProjects.service');
const InstitutionalProjectsPublications = require('../services/institutionalProjectsPublications.service')
const serviceInstitutionalProjects = new InstitutionalProjects();
const serviceInstitutionalProjectsPublications = new InstitutionalProjectsPublications();
const router = express.Router();

router.get('/:id?',
    validatorHandler(queryInstitutionalProjects, 'query'),
    checkIfThereIsToken(),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { link } = req.query;
            const getInstitutionalProject = await serviceInstitutionalProjects.get(id, link, req);
            res.status(200).json(getInstitutionalProject);
        } catch (error) {
        next(error);
        }
    }
);
router.get('/:institutionalProjectsId/publication/:id?',
    validatorHandler(queryInstitutionalProjectsPublications, 'query'),
    checkIfThereIsToken(),
    async (req, res, next) => {
        try {
            const { institutionalProjectsId, id } = req.params;
            const { link } = req.query;
            const getInstitutionalProject = await serviceInstitutionalProjectsPublications.get(req, id, link, institutionalProjectsId);
            res.status(200).json(getInstitutionalProject);
        } catch (error) {
        next(error);
        }
    }
);

router.post('/:id?',
    validatorHandler(checkFiles, 'files.files'),
    (req, res, next) => {
        if (req.params.id) {
            validatorHandler(createInstitutionalProjectsPublicationns, null, true)(req, res, (err) => {
                if (err) return next(err);
                authCombined('access')(req, res, next);
            });
        } else {
            validatorHandler(createInstitutionalProjects, null, true)(req, res, (err) => {
                if (err) return next(err);
                authCombined('access', true)(req, res, next);
            });
        }
    },
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id } = req.params;
            let response;
            if (id) {
                response = await serviceInstitutionalProjectsPublications.create(req, body, id);
            } else {
                response = await serviceInstitutionalProjects.create(req, body);
            }
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:id/:idPublication?',
    validatorHandler(checkFiles, 'files.files'),
    (req, res, next) => {
        if (req.params.idPublication) {
            validatorHandler(updateInstitutionalProjectsPublicationns, null, true)(req, res, (err) => {
                if (err) return next(err);
                authCombined('access')(req, res, next);
            });
        } else {
            validatorHandler(updateInstitutionalProjects, null, true)(req, res, (err) => {
                if (err) return next(err);
                authCombined('access', true)(req, res, next);
            });
        }
    },
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const { id, idPublication } = req.params;
        let response;
        if(id && !idPublication){
            response = await serviceInstitutionalProjects.update(req, body, id);
        } else if(idPublication){
            response = await serviceInstitutionalProjectsPublications.update(req, body, id, idPublication);
        }
        res.json(response);
        } catch (error) {
        next(error);
        }
    }
);

router.delete('/:id/:idPublication?',
    validatorHandler(deleInstitutionalProjectsPublications, null, true),
    (req, res, next) => {
        if(req.params.idPublication) {
            validatorHandler(updateInstitutionalProjectsPublicationns, null, true)(req, res, (err) => {
                if (err) return next(err);
                authCombined('access')(req, res, next);
            });
        } else {
            validatorHandler(updateInstitutionalProjects, null, true)(req, res, (err) => {
                if (err) return next(err);
                authCombined('access', true)(req, res, next);
            });
        }
    },
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const { id, idPublication } = req.params;
            let response;
            if(id && !idPublication){
                response = await serviceInstitutionalProjects.delete(req, body, id);
            } else if(idPublication){
                response = await serviceInstitutionalProjectsPublications.delete(req, body, id, idPublication);
            }
            res.status(200).json(response);
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;