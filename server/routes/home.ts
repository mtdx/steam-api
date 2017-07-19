export const home = [
    {
        method: 'GET',
        path: '/',
        config: {
            auth: {
                strategy: 'token',
                scope: ['user']
            },
             handler: (request, reply) => {
                reply('aaaa2');
             }
        }
    }
];
