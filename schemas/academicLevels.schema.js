const Joi = require('joi');

const { imagesUploads, imagesUpdates } = require('./images');

const { query } = require('./queryParamets.schema');
const id = Joi.number().integer();
const string = Joi.string();
const number = Joi.number();
const boolean = Joi.boolean();
const imageUploadSchema = imagesUploads('idImage');
const imageUpdateSchema = imagesUpdates('idNewImage', 'idImageEliminate')

const queryParameterUser = Joi.object({
    ...query,
    visible: boolean,
    campusNumber: number,
    educationDay: string,
    modality: string
})

const getAcademicLevels = Joi.object({
    id: id.required()
});

const createAcademicLevels = Joi.object({
    nameLevel: string.required(),
    description: string.required(),
    levelCode: number.required(),
    campusNumber: number.required(),
    educationDay: string.required(),
    modality: string.required(),
    educationalObjectives: string.required(),
    admissionRequirements: string.required(),
    visible: boolean,
    ...imageUploadSchema
});
const updateAcademicLevels = Joi.object({
    nameLevel: string,
    description: string,
    levelCode: number,
    campusNumber: number,
    educationDay: string,
    modality: string,
    educationalObjectives: string,
    admissionRequirements: string,
    visible: boolean,
    ...imageUpdateSchema
});
const deleteAcademicLevels = Joi.object({
    eliminateImage: boolean
})


module.exports = { getAcademicLevels, createAcademicLevels, updateAcademicLevels, deleteAcademicLevels, queryParameterUser }