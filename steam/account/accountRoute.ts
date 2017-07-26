import { Scope } from '../../common/scope';
import * as Joi from 'joi';
import { db } from '../../server';
import { SteamAccountRepository } from './SteamAccountRepository';
import * as bunyan from 'bunyan';
import { ErrorSchema, SuccessSchema, PaginationSchema } from '../../common/schema';
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
                query: PaginationSchema
            },
            handler: async (request, reply) => {
                const steamAccounts: SteamAccount[] = await (new SteamAccountRepository(db, log))
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
                const steamAccountRepository: SteamAccountRepository = new SteamAccountRepository(db, log);
                if (await steamAccountRepository.findByAccountName(request.payload.account_name,
                    request.auth.credentials.id) !== null) {
                    reply({
                        error: 'Duplicate Steam Account', message: 'Steam Account Already Exists'
                    }).code(HttpStatus.BAD_REQUEST);
                } else {
                    const steamAccount: SteamAccount = await steamAccountRepository.add([
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
        method: 'POST',
        path: '/api/v1/steam-account/{id}',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            validate: {
                params: {
                    id: Joi.number().required(),
                },
                payload: SteamAccountSchemaIn
            },
            handler: async (request, reply) => {
                const steamAccountRepository: SteamAccountRepository = new SteamAccountRepository(db, log);
                const steamAccount: SteamAccount = await steamAccountRepository.findById(
                    request.params.id, request.auth.credentials.id);
                if (steamAccount === null) {
                    reply({
                        error: 'Not Found', message: 'Steam Account Steam Account'
                    }).code(HttpStatus.BAD_REQUEST);
                } else {
                    steamAccount.role = request.payload.role;
                    steamAccount.account_name = request.payload.account_name;
                    steamAccount.account_password = request.payload.account_password;
                    steamAccount.identity_secret = request.payload.identity_secret;
                    steamAccount.shared_secret = request.payload.shared_secret;
                    const steamAccountUpdated: SteamAccount = await steamAccountRepository.update(steamAccount);
                    reply(steamAccountUpdated).code(HttpStatus.OK);
                }
            },
            response: {
                status: {
                    400: ErrorSchema,
                    200: SteamAccountSchema
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
                const result: any = await (new SteamAccountRepository(db, log)).delete(
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
