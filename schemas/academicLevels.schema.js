const Joi = require('joi');

const id = Joi.number().integer();
const string = Joi.string();
const number = Joi.number();
const bolean = Joi.boolean();

const getAcademicLevels = Joi.object({
    id: id.required()
});

const createAcademicLevels = Joi.object({
    nameLevel: string.required(),
    description: string.required(),
    levelCode: number.required(),
    campus: number.required(),
    modality: string.required(),
    educationalObjectives: string.required(),
    admissionRequirements: string.required(),
    visible: bolean,
    idImage: string,
});
const updateAcademicLevels = Joi.object({
    nameLevel: string,
    description: string,
    levelCode: string,
    campus: string,
    modality: string,
    educationalObjectives: string,
    admissionRequirements: string,
    visible: bolean,
    idNewImage: string,
    idImageEliminate: string,
    eliminateImage: string,
});


module.exports = { getAcademicLevels, createAcademicLevels, updateAcademicLevels }