import { Scope } from '../../common/scope';
import * as Joi from 'joi';

export const groups = [
    {
        method: 'POST',
        path: '/groups',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                payload: {
                    group_link: Joi.string().regex(/^[a-zA-Z0-9_]{2,32}$/),
                }
            },
            handler: (request, reply) => {
                reply('Groups');
            }
        }
    }
];
