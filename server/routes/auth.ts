import * as jwt from 'jsonwebtoken';

const privateKey = process.env.STEAMAPP_TOKEN_SIGNING_KEY || 'InsecurePrivateKey';

export const auth = [
    {
        method: 'GET',
        path: '/auth',
        config: {
             handler: (request, reply) => {
                const token = jwt.sign({ accountId: 1, username: 'admin', scope: ['user'] },
                privateKey, { algorithm: 'HS256'} );
                reply(token);
             }
        }
    }
];
