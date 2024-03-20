const Joi = require('joi');

const { query } = require('./queryParamets.schema');
const string = Joi.string();

const queryParameterSearch = Joi.object({
    ...query,
    term: string.required(),
    rol: string,
    active: Joi.boolean()
})

module.exports = { queryParameterSearch }