"use strict";
const Joi = require('joi');
// ********************** Registration Validation *********************
const registerValidation = (data) => {
    console.log("Data: ", data);
    const schema = Joi.object({
        privateKey: Joi.string().min(66).max(66).required(),
        address: Joi.string().min(42).max(42).required(),
        username: Joi.string().min(8).max(32).pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9])(?!.*( )).{8,}$')).required(),
        password: Joi.string().min(8).max(32).pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9])(?!.*( )).{8,}$')).required(),
    });
    return schema.validate(data);
};
// ********************** Login Validation *********************
const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(8).max(32).pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9])(?!.*( )).{8,}$')).required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9])(?!.*( )).{8,}$')).min(8).max(32).required(),
    });
    return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
