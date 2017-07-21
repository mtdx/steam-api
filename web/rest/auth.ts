import { UserService } from '../../user/UserService';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';
import { db } from '../../common/db';
import { TokenSchema, ErrorSchema } from '../../common/schema';
import { User } from '../../user/User';
import * as bunyan from 'bunyan';

const privateKey = process.env.STEAMAPP_TOKEN_SIGNING_KEY || 'InsecurePrivateKey';
const log = bunyan.createLogger({ name: 'auth' });

export const auth = [
    {
        method: 'POST',
        path: '/auth',
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
                        statusCode: 401,
                        error: 'Authentication Failed',
                        message: 'Invalid Username or Password'
                    }).code(401);
                    return;
                }
                const token = jwt.sign({ id: user.id, username: request.payload.username, scope: user.scope },
                    privateKey, { algorithm: 'HS256' });
                reply({
                    statusCode: 200,
                    token
                }).code(200);
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
