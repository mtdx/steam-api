import * as Joi from 'joi';

export const ErrorSchema = Joi.object({
    statusCode: Joi.number().required(),
    error: Joi.string().required(),
    message: Joi.string(),
});

export const TokenSchema = Joi.object({
    statusCode: Joi.number().required(),
    token: [Joi.string().required(), Joi.number().required()]
});

export const SuccessSchema = Joi.object({
    statusCode: Joi.number().required(),
    id: Joi.number().required()
});
