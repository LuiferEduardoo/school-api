const Joi = require('joi');

const id = Joi.number().integer();
const number = Joi.number();

const getSchoolCourses  = Joi.object({
    id: id.required()
});

const createSchoolCourses = Joi.object({
    grade: number.required(),
    course: number.required(),
    academicLevelId: number.required(),
});
const updateSchoolCourses  = Joi.object({
    course: number,
    grade: number,
    academicLevelId: Joi.when('grade', {
        is: Joi.exist(),
        then: Joi.number().required(),
        otherwise: Joi.forbidden()
    }),
});


module.exports = { getSchoolCourses, createSchoolCourses, updateSchoolCourses }