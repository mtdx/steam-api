import * as Joi from 'joi';

export const SteamGroupSchema = Joi.object({
    id: Joi.number().required(),
    group_link: Joi.string().regex(/^[a-zA-Z0-9_]{2,32}$/),
    created_at: Joi.date().required()
});
