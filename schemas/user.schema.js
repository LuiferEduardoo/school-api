const Joi = require('joi');

const id = Joi.number().integer();
const username = Joi.string();
const email = Joi.string().email();
const name = Joi.string();
const lastName = Joi.string();
const currentPassword = Joi.string().min(8);
const newPassword = Joi.string().min(8);
const password = Joi.string().min(8);
const rol = Joi.string();
const active = Joi.boolean();

const createUserSchema = Joi.object({
    name: name.required(),
    lastName: lastName.required(),
    username: username.required(),
    email: email.required(),
    password: password.required(),
    rol: rol.required()
});

const updateUserSchema = Joi.object({
    name,
    lastName,
    email,
    username,
    currentPassword,
    password: newPassword,
    rol,
    active,
});

const getUserSchema = Joi.object({
    id: id.required(),
});
const getUpdateUserSchema = Joi.object({
    id
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema, getUpdateUserSchema}