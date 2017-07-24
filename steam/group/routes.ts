import { Scope } from '../../common/scope';
import * as Joi from 'joi';
import { db } from '../../common/db';
import { SteamGroupService } from './SteamGroupService';
import * as bunyan from 'bunyan';
import { ErrorSchema, SuccessSchema } from '../../common/schema';
import { SteamGroupSchema } from './schema';
import { SteamGroupStatus, SteamGroup } from './SteamGroup';
import * as HttpStatus from 'http-status-codes';

const log = bunyan.createLogger({ name: 'auth' });
const DEFAULT_GROUP_STATUS = SteamGroupStatus.WORKING;

export const groups = [
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
                        statusCode: HttpStatus.BAD_REQUEST,
                        error: 'Duplicate Steam Group',
                        message: 'Steam Group Link Already Exists'
                    }).code(HttpStatus.BAD_REQUEST);
                } else {
                    const steamGroup: SteamGroup = await steamGroupService.add(DEFAULT_GROUP_STATUS,
                        request.payload.group_link, request.auth.credentials.id);
                    reply({
                        statusCode: HttpStatus.CREATED,
                        statusName: SteamGroupStatus[steamGroup.status],
                        ...steamGroup
                    }).code(HttpStatus.CREATED);
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
                reply({ statusCode: HttpStatus.OK, id: request.params.id }).code(HttpStatus.OK);
            },
            response: {
                status: {
                    200: SuccessSchema
                }
            }
        }
    }
];
