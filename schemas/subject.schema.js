const Joi = require('joi');

const { query } = require('./queryParamets.schema');
const id = Joi.number().integer();
const string = Joi.string();
const number = Joi.number();

const queryParameterSubject = Joi.object({
    ...query,
    teacher: string
})

const getSubject = Joi.object({
    academicLevelId: number.required(),
    id: id
});
const parameterSubject = Joi.object({
    academicLevelId: number.required()
});
const createSubject = Joi.object({
    name: string.required(),
    teacherId: number.required(),
});
const updateSubject = Joi.object({
    name: string,
    academicLevelId: id,
    teacherId: number,
});


module.exports = { getSubject, createSubject, updateSubject, parameterSubject, queryParameterSubject }