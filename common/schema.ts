import * as Joi from 'joi';

export const ErrorSchema = Joi.object({
    statusCode: Joi.number().optional(),
    error: Joi.string().required(),
    message: Joi.string(),
});

export const TokenSchema = Joi.object({
    token: [Joi.string().required(), Joi.number().required()]
});

export const SuccessSchema = Joi.object({
    id: Joi.number().required()
});
