const Joi = require('joi');

const { imagesUploads, imagesUpdates } = require('./images')

const id = Joi.number().integer();
const string = Joi.string();
const number = Joi.number();
const boolean = Joi.boolean();
const imageUploadSchema = imagesUploads('idImage');
const imageUpdateSchema = imagesUpdates('idNewImage', 'idImageEliminate')

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
    visible: boolean,
    ...imageUploadSchema
});
const updateAcademicLevels = Joi.object({
    nameLevel: string,
    description: string,
    levelCode: string,
    campus: string,
    modality: string,
    educationalObjectives: string,
    admissionRequirements: string,
    visible: boolean,
    ...imageUpdateSchema
});
const deleteAcademicLevels = Joi.object({
    eliminateImage: boolean
})


module.exports = { getAcademicLevels, createAcademicLevels, updateAcademicLevels, deleteAcademicLevels }