import * as jwt from 'jsonwebtoken';
import * as joi from 'joi';
import { db } from '../../common/db';

const privateKey = process.env.STEAMAPP_TOKEN_SIGNING_KEY || 'InsecurePrivateKey';

const getUserFromDb = async (username: string, password: string) =>
    db.oneOrNone(
        'SELECT id, scope FROM users WHERE username = $1 AND password = $2',
        [username, password]
    );

export const auth = [
    {
        method: 'POST',
        path: '/auth',
        config: {
            validate: {
                payload: {
                    username: joi.string().alphanum().min(3).max(20).required(),
                    password: joi.string().min(6).max(40).required()
                }
            },
            handler: async (request, reply) => {
                // obviously password should be salted and hashed but for personal use is OK.
                const user = await getUserFromDb(request.payload.username, request.payload.password);
                if (!user) {
                    reply({ statusCode: 401, error: 'Invalid Username or Password' });
                    return;
                }
                const token = jwt.sign({ id: user.id, username: request.payload.username, scope: user.scope },
                    privateKey, { algorithm: 'HS256' });
                reply({ statusCode: 200, token });
            }
        }
    }
];
