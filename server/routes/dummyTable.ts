export const dummyTable = [
    {
        method: 'GET',
        path: '/dt1',
        config: {
            auth: {
                strategy: 'token',
                scope: ['user']
            },
             handler: (request, reply) => {
                reply('Hello!');
             }
        }
    },
    {
        method: 'GET',
        path: '/dr1a',
        config: {
            auth: {
                strategy: 'token',
                scope: ['user']
            },
             handler: (request, reply) => {
                reply('Hello!');
             }
        }
    }
];
