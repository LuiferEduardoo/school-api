const Joi = require('joi');
const { getPublications, createPublication, updatePublication, deletePublication } = require('./publications');

const { query } = require('./queryParamets.schema');
const id = Joi.number();
const authors = Joi.string();
const date = Joi.date().iso();

const queryInstitutionalProjectsPublications = Joi.object({
    ...query,
    link: Joi.string(),
    important: Joi.boolean(),
    visible: Joi.boolean(),
    author: Joi.number()
})

const createInstitutionalProjectsPublicationns = Joi.object({
    ...createPublication,
    authors
});

const updateInstitutionalProjectsPublicationns = Joi.object({
    ...updatePublication,
    idsNewAuthors: authors,
    idsEliminateAuthors: authors
});

const deleInstitutionalProjectsPublications = Joi.object({
    ...deletePublication
})

module.exports = { createInstitutionalProjectsPublicationns, updateInstitutionalProjectsPublicationns, deleInstitutionalProjectsPublications, queryInstitutionalProjectsPublications };