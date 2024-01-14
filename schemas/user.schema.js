const Joi = require('joi');

const id = Joi.number().integer();
const string = Joi.string();
const email = Joi.string().email();
const password = string
    .min(8)
    .regex(/[a-z]/) // Al menos una minúscula
    .regex(/[A-Z]/) // Al menos una mayúscula
    .regex(/\d/) // Al menos un número
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/) // Al menos un carácter especial
const boolean = Joi.boolean();
const { imagesUpdates } = require('./images');

const imageUpdateSchema = imagesUpdates('idNewImage', 'idImageEliminate')

const createUserSchema = Joi.object({
    name: string.required(),
    lastName: string.required(),
    username: string.required(),
    email: email.required(),
    password: password.required(),
    rol: string.required()
});

const updateUserSchema = Joi.object({
    name: string,
    lastName: string,
    email,
    username: string,
    currentPassword: string,
    password: Joi.when('currentPassword', {
        is: Joi.exist(),
        then: password
            .invalid(Joi.ref('currentPassword'))
            .required(),
        otherwise: Joi.forbidden()
    }),
    closeOtherDevices: Joi.when('password', {
        is: Joi.exist(),
        then: boolean.required(),
        otherwise: Joi.forbidden()
    }),
    rol: string,
    active: boolean,
    ...imageUpdateSchema
});

const getUserSchema = Joi.object({
    id: id.required(),
});
const getUpdateUserSchema = Joi.object({
    id
});
const deleteUserSchema = Joi.object({
    eliminateImage: Joi.boolean()
})

module.exports = { createUserSchema, updateUserSchema, deleteUserSchema, getUserSchema, getUpdateUserSchema}