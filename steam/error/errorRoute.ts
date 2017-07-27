import { Scope } from '../../common/scope';
import * as Joi from 'joi';
import { db } from '../../server';
import { SteamErrorRepository } from './SteamErrorRepository';
import * as bunyan from 'bunyan';
import { PaginationSchema } from '../../common/schema';
import { SteamError, SteamErrorSchema } from './SteamError';
import * as HttpStatus from 'http-status-codes';

const log = bunyan.createLogger({ name: 'steamerror' });

export const error = [
    {
        method: 'GET',
        path: '/api/v1/steam-error',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                query: PaginationSchema
            },
            handler: async (request, reply) => {
                const steamErrors: SteamError[] = await (new SteamErrorRepository(db, log))
                    .findAll(request.query.size, (request.query.page - 1) * request.query.size,
                    request.auth.credentials.id);
                reply(steamErrors).code(HttpStatus.OK);
            },
            response: {
                schema: Joi.array().items(SteamErrorSchema)
            }
        }
    }
];
