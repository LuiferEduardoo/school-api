const Joi = require('joi');

const id = Joi.number().integer();
const string = Joi.string();
const number = Joi.number();

const getSubject = Joi.object({
    id: id.required()
});

const createSubject = Joi.object({
    name: string.required(),
    academicLevelId: id.required(),
    teacherId: number.required(),
});
const updateSubject = Joi.object({
    name: string,
    academicLevelId: id,
    teacherId: number,
});


module.exports = { getSubject, createSubject, updateSubject }