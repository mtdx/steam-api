import { Scope } from '../../common/scope';
import * as Joi from 'joi';
import { db } from '../../server';
import { SteamGroupService } from './SteamGroupService';
import * as bunyan from 'bunyan';
import { ErrorSchema, SuccessSchema } from '../../common/schema';
import { SteamGroupSchema } from './schema';
import { SteamGroupStatus, SteamGroup } from './SteamGroup';
import * as HttpStatus from 'http-status-codes';

const log = bunyan.createLogger({ name: 'auth' });

export const groups = [
    {
        method: 'GET',
        path: '/api/v1/steam-group',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                query: {
                    page: Joi.number().integer().default(0),
                    size: Joi.number().integer().min(20).max(120).default(40),
                }
            },
            handler: async (request, reply) => {
                const steamGroups: SteamGroup[] = await (new SteamGroupService(db, log))
                    .findAll(request.query.size, request.query.page * request.query.size);
                reply({ steamGroups }).code(HttpStatus.OK);
            },
            response: {
                schema: Joi.array().items(SteamGroupSchema)
            }
        }
    },
    {
        method: 'POST',
        path: '/api/v1/steam-group',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                payload: {
                    group_link: Joi.string().regex(/^[a-zA-Z0-9_]{2,32}$/).lowercase().required(),
                }
            },
            handler: async (request, reply) => {
                const steamGroupService: SteamGroupService = new SteamGroupService(db, log);
                if (await steamGroupService.findByGroupLink(request.payload.group_link) != null) {
                    reply({
                        error: 'Duplicate Steam Group', message: 'Steam Group Link Already Exists'
                    }).code(HttpStatus.BAD_REQUEST);
                } else {
                    const steamGroup: SteamGroup = await steamGroupService.add(SteamGroupStatus.WORKING,
                        request.payload.group_link, request.auth.credentials.id);
                    reply({ statusName: SteamGroupStatus[steamGroup.status], ...steamGroup })
                        .code(HttpStatus.CREATED);
                }
            },
            response: {
                status: {
                    400: ErrorSchema,
                    201: SteamGroupSchema
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/v1/steam-group/{id}',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                params: {
                    id: Joi.number().required(),
                }
            },
            handler: async (request, reply) => {
                await (new SteamGroupService(db, log)).delete(request.params.id);
                reply({ id: request.params.id }).code(HttpStatus.OK);
            },
            response: {
                status: {
                    200: SuccessSchema
                }
            }
        }
    }
];
