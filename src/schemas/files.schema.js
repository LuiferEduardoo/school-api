const Joi = require('joi');

const id = Joi.number().integer();
const string = Joi.string();
const files = Joi.binary()
    .min(1)
    .max(20 * 1024 * 1024)
;

const checkFiles = Joi.object({
    files
})

const getFiles = Joi.object({
    id: id.required(),
});

const getFileNoRequired = Joi.object({
    id
})

const createFiles = Joi.object({
    folder: string.required(),
    fileType: string.required(),
    isPublic: string.required(),
    imageCredits: string,
});

const updateFiles = Joi.object({
    newName: string,
    newFolder: string,
    isPublic: Joi.boolean(),
    imageCredits: string,
})

module.exports = { checkFiles, getFileNoRequired, getFiles, createFiles, updateFiles };