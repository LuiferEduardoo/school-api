const Joi = require('joi');

const limit = Joi.number().integer();
const offset = Joi.number().integer(); 

const queryParamets = Joi.object({
    limit,
    offset
});
module.exports = { queryParamets }