const Joi = require('joi');

const id = Joi.number().integer();
const string = Joi.string();
const bolean = Joi.boolean();
const date = Joi.date().iso();

const getCalendar = Joi.object({
    id: id.required()
});

const createCalendar = Joi.object({
    title: string.required(),
    description: string.required(),
    startDate: date.required(),
    endDate: date.required().min(Joi.ref('startDate'))
});
const updateCalendar = Joi.object({
    title: string,
    description: string,
    startDate: date,
    endDate: date,
    visible: bolean,
});


module.exports = { getCalendar, createCalendar, updateCalendar }