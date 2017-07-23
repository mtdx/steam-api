import { Scope } from '../../common/scope';

export const groups = [
    {
        method: 'GET',
        path: '/',
        config: {
            auth: {
                strategy: 'token',
                scope: Scope.User
            },
            handler: (request, reply) => {
                reply('Groups');
            }
        }
    }
];
