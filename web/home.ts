import { Scope } from '../common/scope';

export const home = [
    {
        method: 'GET',
        path: '/api/v1',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            handler: (request, reply) => {
                reply('Hello World');
            }
        }
    }
];
