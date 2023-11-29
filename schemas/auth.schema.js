const Joi = require('joi');

const email = Joi.string().email();
const password = Joi.string().min(8);
const token = Joi.string().min(8);

const login = Joi.object({
    email: email.required(),
    password: password.required(),
});
const recovery = Joi.object({
    email: email.required(),
});

const changePassword = Joi.object({
    newPassword: password.required(),
    token: token.required(),
});


module.exports = { login, recovery, changePassword }