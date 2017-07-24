import * as Joi from 'joi';

export const SteamGroupSchema = Joi.object({
    group_link: Joi.string().regex(/^[a-zA-Z0-9_]{2,32}$/),
    created_at: Joi.date().required()
});
