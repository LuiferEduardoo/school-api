const Joi = require('joi');

const id = Joi.number().integer();
const elimianteImages = Joi.string();
const imageCredits = Joi.string();
const banners = Joi.string();
const description = Joi.string();
const ids = Joi.string();

const getBanner = Joi.object({
    banners: banners.required(),
    id: id,
});

const createBanner = Joi.object({
    imageCredits,
    description,
    ids,
});

const updateBanner = Joi.object({
    description,
    idsBanners: ids.required(),
})

const deleteBanner = Joi.object({
    idsBanners: ids.required(),
    elimianteImages
});

module.exports = { getBanner, createBanner, updateBanner, deleteBanner };