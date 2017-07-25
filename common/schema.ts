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

export const PaginationSchema = Joi.object({
    page: Joi.number().integer().default(1).positive(),
    size: Joi.number().integer().min(10).max(120).default(40)
});
