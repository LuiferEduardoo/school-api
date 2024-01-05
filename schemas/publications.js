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

const getPublications = Joi.object({
    id: id.required()
})

const createPublication = {
    title: title.required(),
    content: content.required(),
    important,
    visible,
    idImage,
    categories: categories.required(),
    subcategories,
    tags
};

const updatePublication = {
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
};

const deletePublication = {
    eliminateImage
}

module.exports = { getPublications, createPublication, updatePublication, deletePublication };