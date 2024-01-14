const Joi = require('joi');

const { imagesUploads, imagesUpdates } = require('./images')

const string = Joi.string();
const id = Joi.number();
const boolean = Joi.boolean();
const imageUploadSchema = imagesUploads('idImage');
const imageUpdateSchema = imagesUpdates('idNewImage', 'idImageEliminate')

const getPublications = {
    id: id.required()
};

const createPublication = {
    title: string.required(),
    content: string.required(),
    important: boolean,
    visible: boolean,
    ...imageUploadSchema,
    categories: string.required(),
    subcategories: string,
    tags: string
};

const updatePublication = {
    title: string,
    content: string,
    important: boolean,
    visible: boolean,
    ...imageUpdateSchema,
    eliminateImage: string,
    idsEliminateCategories: string,
    idsEliminateSubcategories: string,
    idsEliminateTags: string,
    categories: string,
    subcategories: string,
    tags: string
};

const deletePublication = {
    eliminateImage: boolean
}

module.exports = { getPublications, createPublication, updatePublication, deletePublication };