const Joi = require('joi');

const title = Joi.string();
const id = Joi.number();
const content = Joi.string();
const important = Joi.boolean();
const visible = Joi.boolean();
const eliminateImage = Joi.string();
const idImage = Joi.string();
const categories = Joi.string();
const subcategories = Joi.string();
const tags = Joi.string();

const getNewsPublications = Joi.object({
    id: id.required()
})

const createNewsPublication = Joi.object({
    title: title.required(),
    content: content.required(),
    important,
    visible,
    idImage,
    categories: categories.required(),
    subcategories,
    tags
});

const updateNewsPublication = Joi.object({
    title,
    content,
    important,
    visible,
    idNewImage: idImage,
    idImageEliminate: idImage,
    eliminateImage,
    idsEliminateCategories: categories,
    idsEliminateSubcategories: subcategories,
    idsEliminateTags: tags,
    categories,
    subcategories,
    tags
});

module.exports = { getNewsPublications, createNewsPublication, updateNewsPublication };