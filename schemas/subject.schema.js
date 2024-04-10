const Joi = require('joi');

const { query } = require('./queryParamets.schema');
const id = Joi.number().integer();
const string = Joi.string();
const number = Joi.number();

const queryParameterSubject = Joi.object({
    ...query,
    teacher: string
})

const parametersGetSubject= Joi.object({
    academicLevelId: number.required(),
    id: id
});
const parametersUpdateOrDeleteSubject = Joi.object({
    id: id.required()
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
    teacherId: number,
});


module.exports = { parametersGetSubject, parametersUpdateOrDeleteSubject, createSubject, updateSubject, parameterSubject, queryParameterSubject }