import * as Joi from 'joi';

export const SteamGroupSchema = Joi.object({
    statusCode: Joi.number().required(),
    statusName: Joi.string().regex(/^[a-zA-Z0-9_]{2,20}$/).required(),
    id: Joi.number().required(),
    status: Joi.number().required(),
    group_link: Joi.string().regex(/^[a-zA-Z0-9_]{2,32}$/).required(),
    created_at: Joi.date().required(),
});
