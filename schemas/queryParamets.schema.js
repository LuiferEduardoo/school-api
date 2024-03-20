const Joi = require('joi');

const limit = Joi.number().integer();
const offset = Joi.number().integer(); 

const query = {
    limit,
    offset,
    search: Joi.string()
}

const queryParamets = Joi.object({
    ...query
});
module.exports = { queryParamets, query }