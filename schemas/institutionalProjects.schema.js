const Joi = require('joi');
const { getPublications, createPublication, updatePublication } = require('./publications');

const { query } = require('./queryParamets.schema');

const id = Joi.number();
const members = Joi.string();
const date = Joi.date().iso();

const queryInstitutionalProjects = Joi.object({
    ...query,
    link: Joi.string(),
    important: Joi.boolean(),
    visible: Joi.boolean(),
    member: Joi.number()
})

const createInstitutionalProjects = Joi.object({
    ...createPublication,
    startedAt: date.required(),
    finishedAT: date,
    members: members,
    isCoordinator: Joi.when('members', {
        is: Joi.exist(), // Verifica si idsNewMembers existe
        then: Joi.string().required(), // Si existe, isCoordinator es requerido
        otherwise: Joi.forbidden() // Si no existe, isCoordinator está prohibido
    }),
});

const updateInstitutionalProjects = Joi.object({
    ...updatePublication,
    startedAt: date,
    finishedAT: date,
    idsNewMembers: members,
    isCoordinator: Joi.when('idsNewMembers', {
        is: Joi.exist(), // Verifica si idsNewMembers existe
        then: Joi.string().required(), // Si existe, isCoordinator es requerido
        otherwise: Joi.forbidden() // Si no existe, isCoordinator está prohibido
    }),
    updateMembers: members,
    updateIsCoordinator: Joi.when('updateMembers', {
        is: Joi.exist(),
        then: Joi.string().required(),
        otherwise: Joi.forbidden()
    }),
    idsEliminateMembers: members
});

module.exports = { createInstitutionalProjects, updateInstitutionalProjects, queryInstitutionalProjects };