const Joi = require('joi');

const { imagesUploads } = require('./images');

const id = Joi.number().integer();
const elimianteImages = Joi.string();
const imageCredits = Joi.string();
const banners = Joi.string();
const description = Joi.string();
const ids = Joi.string();
const imageUploadSchema = imagesUploads('ids');

const getBanner = Joi.object({
    banners: banners.required(),
    id: id,
});

const createBanner = Joi.object({
    imageCredits,
    description,
    ...imageUploadSchema,
});

const updateBanner = Joi.object({
    idsBanners: ids.required(),
    description: description.required()
})

const deleteBanner = Joi.object({
    idsBanners: ids.required(),
    elimianteImages
});

module.exports = { getBanner, createBanner, updateBanner, deleteBanner };