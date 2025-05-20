const Joi = require('joi');
const { query } = require('./queryParamets.schema');
const { getPublications, createPublication, updatePublication, deletePublication } = require('./publications');

const queryNewsPublications = Joi.object({
    ...query,
    important: Joi.boolean(),
    visible: Joi.boolean(),
    link: Joi.string()
})

const getNewsPublications = Joi.object(getPublications)

const createNewsPublication = Joi.object(createPublication);

const updateNewsPublication = Joi.object(updatePublication);

const deleteNewsPublication = Joi.object(deletePublication);

module.exports = { getNewsPublications, createNewsPublication, updateNewsPublication, deleteNewsPublication, queryNewsPublications };