
export const dbOptions = {
    host: process.env.STEAMAPP_DB_HOST || 'localhost',
    user: process.env.STEAMAPP_DB_USER || 'steamapp',
    password: process.env.STEAMAPP_DB_PASSWORD || 'password',
    database: process.env.STEAMAPP_DB_DATABASE || 'steamapp'
};
