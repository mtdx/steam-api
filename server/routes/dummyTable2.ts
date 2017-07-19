export const dummyTable2 = [
    {
        method: 'GET',
        path: '/dr2',
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
