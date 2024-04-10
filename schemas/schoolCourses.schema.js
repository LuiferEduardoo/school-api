const Joi = require('joi');

const id = Joi.number().integer();
const number = Joi.number();
const { query } = require('./queryParamets.schema');

const queryParameterSchoolCourse = Joi.object({
    ...query
})

const getSchoolCourses  = Joi.object({
    academicLevelId: number.required(),
    id: id
});

const createSchoolCourses = Joi.object({
    grade: number.required(),
    course: number.required()
});
const parameterSchoolCourses = Joi.object({
    academicLevelId: number.required()
});
const updateSchoolCourses  = Joi.object({
    course: number,
    grade: number,
});


module.exports = { getSchoolCourses, createSchoolCourses, updateSchoolCourses, parameterSchoolCourses, queryParameterSchoolCourse }