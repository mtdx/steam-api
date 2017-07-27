import * as Joi from 'joi';

export interface SteamError {
  id: number;
  code?: number;
  error: string;
  message?: string;
  steam_account_name?: string;
  created_at: Date;
}

// out schema
export const SteamErrorSchema = Joi.object({
    id: Joi.number().required(),
    steam_account_name: Joi.string().required(),
    code: Joi.number().optional(),
    error: Joi.string().required(),
    message: Joi.string().optional(),
    created_at: Joi.date().required(),
});
