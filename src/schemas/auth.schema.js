const Joi = require('joi');

const email = Joi.string().email();
const password = Joi.string()
    .min(8)
    .regex(/[a-z]/) // Al menos una minúscula
    .regex(/[A-Z]/) // Al menos una mayúscula
    .regex(/\d/) // Al menos un número
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/) // Al menos un carácter especial
const token = Joi.string().min(8);

const login = Joi.object({
    credential: Joi.string().required(),
    password: Joi.string().required(),
});
const recovery = Joi.object({
    email: email.required(),
});

const changePassword = Joi.object({
    newPassword: password.required(),
    token: token.required(),
});


module.exports = { login, recovery, changePassword }