import * as Joi from 'joi';

export interface User {
  id: number;
  username: string;
  scope: number;
  status: UserStatus;
  createdAt: Date;
}

export const enum UserStatus {
    ACTIVE = 1,
    INACTIVE
}

// out schema
export const AccountSchema = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().alphanum().min(3).max(20).required(),
});
