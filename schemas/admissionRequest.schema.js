const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const string = Joi.string();
const number = Joi.number();
const date = Joi.date().iso();

const getAdmissionRequest  = Joi.object({
    id: id.required()
});

const createAdmissionRequest = Joi.object({
    academicLevel: id.required(),
    grade: id.required(),
    firstName: string.required(),
    secondName: string,
    surname: string.required(),
    secondSurname: string.required(),
    birthdate: date.required(),
    gender: string.required(),
    documentType: string.required(),
    numberDocument: number.required(),
    phoneNumber: number.required(),
    email: email.required(),
});
const updateAdmissionRequest  = Joi.object({
    academicLevel: id,
    grade: id,
    firstName: string,
    secondName: string,
    surname: string,
    secondSurname: string,
    birthdate: date,
    gender: string,
    documentType: string,
    numberDocument: number,
    phoneNumber: number,
    email: email,
    status: string
});


module.exports = { getAdmissionRequest, createAdmissionRequest, updateAdmissionRequest }