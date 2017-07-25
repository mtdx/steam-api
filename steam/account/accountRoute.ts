import { Scope } from '../../common/scope';
import * as Joi from 'joi';
import { db } from '../../server';
import { SteamAccountService } from './SteamAccountService';
import * as bunyan from 'bunyan';
import { ErrorSchema, SuccessSchema } from '../../common/schema';
import { SteamAccountStatus, SteamAccount, SteamAccountSchema, SteamAccountSchemaIn } from './SteamAccount';
import * as HttpStatus from 'http-status-codes';

const log = bunyan.createLogger({ name: 'steamaccount' });

export const account = [
    {
        method: 'GET',
        path: '/api/v1/steam-account',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                query: {
                    page: Joi.number().integer().default(1).positive(),
                    size: Joi.number().integer().min(10).max(120).default(40),
                }
            },
            handler: async (request, reply) => {
                const steamAccounts: SteamAccount[] = await (new SteamAccountService(db, log))
                    .findAll(request.query.size, (request.query.page - 1) * request.query.size,
                    request.auth.credentials.id);
                reply(steamAccounts).code(HttpStatus.OK);
            },
            response: {
                schema: Joi.array().items(SteamAccountSchema)
            }
        }
    },
    {
        method: 'POST',
        path: '/api/v1/steam-account',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                payload: SteamAccountSchemaIn
            },
            handler: async (request, reply) => {
                const steamAccountService: SteamAccountService = new SteamAccountService(db, log);
                if (await steamAccountService.findByAccountName(request.payload.account_name,
                    request.auth.credentials.id) !== null) {
                    reply({
                        error: 'Duplicate Steam Account', message: 'Steam Account Already Exists'
                    }).code(HttpStatus.BAD_REQUEST);
                } else {
                    const steamAccount: SteamAccount = await steamAccountService.add([
                        SteamAccountStatus.IDLE,
                        request.payload.role,
                        request.payload.account_name,
                        request.payload.account_password,
                        request.payload.identity_secret,
                        request.payload.shared_secret,
                        request.auth.credentials.id
                    ]);
                    reply(steamAccount).code(HttpStatus.CREATED);
                }
            },
            response: {
                status: {
                    400: ErrorSchema,
                    201: SteamAccountSchema
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/v1/steam-account/{id}',
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
                const result: any = await (new SteamAccountService(db, log)).delete(
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
