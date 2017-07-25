import * as Joi from 'joi';

export interface SteamAccount {
  id: number;
  status: SteamAccountStatus;
  role: SteamAccountRole;
  account_name: string;
  account_password: string;
  identity_secret: string;
  shared_secret: string;
  user_id?: number;
  created_at: Date;
}

export enum SteamAccountStatus {
  IDLE = 1,
  WORKING,
  DONE,
  LOCK,
  PAUSED,
  ERROR
}

export enum SteamAccountRole {
  INVITE = 1,
  PRICE,
  TRADE
}

// out schema
export const SteamAccountSchema = Joi.object({
    id: Joi.number().required(),
    status: Joi.number().required(),
    role: Joi.number().required(),
    account_name: Joi.string().required(),
    account_password: Joi.string().required(),
    identity_secret: Joi.string().required(),
    shared_secret: Joi.string().required(),
    message: Joi.string(),
    created_at: Joi.date().required(),
});

export const SteamAccountSchemaIn = Joi.object({
    role: Joi.number().required(),
    account_name: Joi.string().required(),
    account_password: Joi.string().required(),
    identity_secret: Joi.string().required(),
    shared_secret: Joi.string().required(),
});
