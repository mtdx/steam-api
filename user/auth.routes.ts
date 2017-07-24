import { UserService } from './UserService';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';
import { db } from '../server';
import { TokenSchema, ErrorSchema } from '../common/schema';
import { User } from './User';
import * as bunyan from 'bunyan';
import * as HttpStatus from 'http-status-codes';

const privateKey = process.env.STEAMAPP_TOKEN_SIGNING_KEY || 'InsecurePrivateKey';
const log = bunyan.createLogger({ name: 'auth' });

export const auth = [
    {
        method: 'POST',
        path: '/api/v1/auth',
        config: {
            validate: {
                payload: {
                    username: Joi.string().alphanum().min(3).max(20).required(),
                    password: Joi.string().min(6).max(40).required()
                }
            },
            handler: async (request, reply) => {
                // obviously password should be salted and hashed but for personal use is OK.
                const user: User = await (new UserService(db, log))
                    .findByUsernameAndPassword(request.payload.username, request.payload.password);
                if (!user) {
                    reply({
                        statusCode: HttpStatus.UNAUTHORIZED,
                        error: 'Authentication Failed',
                        message: 'Invalid Username or Password'
                    }).code(HttpStatus.UNAUTHORIZED);
                } else {
                    const token = jwt.sign({ id: user.id, username: request.payload.username, scope: user.scope },
                        privateKey, { algorithm: 'HS256' });
                    reply({ statusCode: HttpStatus.OK, token }).code(HttpStatus.OK);
                }
            },
            response: {
                status: {
                    401: ErrorSchema,
                    200: TokenSchema
                }
            }
        }
    }
];
