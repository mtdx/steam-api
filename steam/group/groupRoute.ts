import { Scope } from '../../common/scope';
import * as Joi from 'joi';
import { db } from '../../server';
import { SteamGroupService } from './SteamGroupService';
import * as bunyan from 'bunyan';
import { ErrorSchema, SuccessSchema, PaginationSchema } from '../../common/schema';
import { SteamGroupStatus, SteamGroup, SteamGroupSchema, SteamGroupSchemaIn } from './SteamGroup';
import * as HttpStatus from 'http-status-codes';

const log = bunyan.createLogger({ name: 'steamgroup' });

export const group = [
    {
        method: 'GET',
        path: '/api/v1/steam-group',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                query: PaginationSchema
            },
            handler: async (request, reply) => {
                const steamGroups: SteamGroup[] = await (new SteamGroupService(db, log))
                    .findAll(request.query.size, (request.query.page - 1) * request.query.size,
                    request.auth.credentials.id);
                reply(steamGroups).code(HttpStatus.OK);
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
                payload: SteamGroupSchemaIn
            },
            handler: async (request, reply) => {
                const steamGroupService: SteamGroupService = new SteamGroupService(db, log);
                if (await steamGroupService.findByGroupLink(request.payload.group_link,
                    request.auth.credentials.id) !== null) {
                    reply({
                        error: 'Duplicate Steam Group', message: 'Steam Group Link Already Exists'
                    }).code(HttpStatus.BAD_REQUEST);
                } else {
                    const steamGroup: SteamGroup = await steamGroupService.add(SteamGroupStatus.WORKING,
                        request.payload.group_link, request.auth.credentials.id);
                    reply(steamGroup).code(HttpStatus.CREATED);
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
                const result: any = await (new SteamGroupService(db, log)).delete(
                    request.params.id, request.auth.credentials.id);
                reply({ id: result.id }).code(HttpStatus.OK);
            },
            response: {
                status: {
                    200: SuccessSchema
                }
            }
        }
    }
];
