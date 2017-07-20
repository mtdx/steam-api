import * as pgPromise from 'pg-promise';
import * as pgMonitor from 'pg-monitor';

const pgpOptions = {};
pgMonitor.attach(pgpOptions);

export const db = pgPromise(pgpOptions)({
    host: process.env.STEAMAPP_DB_HOST || 'localhost',
    user: process.env.STEAMAPP_DB_USER || 'steamapp',
    password: process.env.STEAMAPP_DB_PASSWORD || 'password',
    database: process.env.STEAMAPP_DB_DATABASE || 'steamapp'
});
