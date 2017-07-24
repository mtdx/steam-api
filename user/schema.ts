import * as Joi from 'joi';

export const AccountSchema = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().alphanum().min(3).max(20).required(),
});
