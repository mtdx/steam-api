import * as Joi from 'joi';

export const ErrorSchema = Joi.object({
    statusCode: Joi.number().required(),
    error: Joi.string().required(),
    message: Joi.string(),
});

export const UserSchema = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().alphanum().min(3).max(20).required(),
});

export const TokenSchema = Joi.object({
    statusCode: Joi.number().required(),
    token: [Joi.string().required(), Joi.number().required()]
});
