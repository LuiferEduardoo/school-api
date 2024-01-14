const Joi = require('joi');
const { getPublications, createPublication, updatePublication, deletePublication } = require('./publications');

const getNewsPublications = Joi.object(getPublications)

const createNewsPublication = Joi.object(createPublication);

const updateNewsPublication = Joi.object(updatePublication);

const deleteNewsPublication = Joi.object(deletePublication);

module.exports = { getNewsPublications, createNewsPublication, updateNewsPublication, deleteNewsPublication };