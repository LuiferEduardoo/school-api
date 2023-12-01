const Joi = require('joi');

const id = Joi.number().integer();
const folder = Joi.string();
const newName = Joi.string();
const file = Joi.string();
const imageCredits = Joi.string();
const fileType = Joi.string();

const getFilesRegistration = Joi.object({
    id: id.required(),
});

const createFilesRegistrationDate = Joi.object({
    folder: folder.required(),
    fileType: fileType.required(),
    imageCredits,
});
const createFile = Joi.object({
    file: file.required(),
});

const updateFilesRegistration = Joi.object({
    newName,
    newFolder: folder,
    imageCredits,
})

module.exports = { getFilesRegistration, createFilesRegistrationDate, createFile, updateFilesRegistration };