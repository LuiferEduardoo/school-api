const Joi = require('joi');
const { getPublications, createPublication, updatePublication, deletePublication } = require('./publications');

const id = Joi.number();
const authors = Joi.string();
const date = Joi.date().iso();

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

module.exports = { createInstitutionalProjectsPublicationns, updateInstitutionalProjectsPublicationns, deleInstitutionalProjectsPublications };