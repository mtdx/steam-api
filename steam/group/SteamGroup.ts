import * as Joi from 'joi';

export interface SteamGroup {
  id: number;
  status: SteamGroupStatus;
  group_link: string;
  user_id?: number;
  created_at: Date;
}

export enum SteamGroupStatus {
  WORKING = 1,
  DONE,
  LOCK,
  PAUSED,
  ERROR
}

// out schema
export const SteamGroupSchema = Joi.object({
    id: Joi.number().required(),
    status: Joi.number().required(),
    group_link: Joi.string().regex(/^[a-zA-Z0-9_]{2,32}$/).required(),
    created_at: Joi.date().required(),
});
