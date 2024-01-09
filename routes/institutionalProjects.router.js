const express = require('express');

const authCombined = require('../middlewares/authCombined.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { createInstitutionalProjects, updateInstitutionalProjects } = require('../schemas/institutionalProjects.schema');
const { createInstitutionalProjectsPublicationns, updateInstitutionalProjectsPublicationns, deleInstitutionalProjectsPublications } = require('../schemas/institutionalProjectsPublications.schema');
const { queryParamets } = require('../schemas/queryParamets.schema');

const InstitutionalProjects = require('../services/institutionalProjects.service');
const InstitutionalProjectsPublications = require('../services/institutionalProjectsPublications.service')
const serviceInstitutionalProjects = new InstitutionalProjects();
const serviceInstitutionalProjectsPublications = new InstitutionalProjectsPublications();
const router = express.Router();

router.get('/:id?',
    validatorHandler(queryParamets, 'query'),
    (req, res, next) => {
        if (!req.headers.authorization) {
            return next();  // Si no hay token en los headers, continúa sin autenticar
        }
        authCombined('access')(req, res, next);
    },
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const getInstitutionalProject = await serviceInstitutionalProjects.get(id, req);
            res.status(200).json(getInstitutionalProject);
        } catch (error) {
        next(error);
        }
    }
);
router.post('/:id?',
    authCombined('access'), 
    (req, res, next) => {
        if (req.params.id) {
            validatorHandler(createInstitutionalProjectsPublicationns, null, true)(req, res, next); // Si hay un ID presente, utiliza el validador específico para publicaciones
        } else {
            validatorHandler(createInstitutionalProjects, null, true)(req, res, next); // Si no hay un ID, utiliza el validador para la creación de proyectos
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
    authCombined('access'),
    (req, res, next) => {
        if(req.params.idPublication) {
            validatorHandler(updateInstitutionalProjectsPublicationns, null, true)(req, res, next);
        } else {
            validatorHandler(updateInstitutionalProjects, null, true)(req, res, next);
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
    authCombined('access'),
    validatorHandler(deleInstitutionalProjectsPublications, null, true),
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