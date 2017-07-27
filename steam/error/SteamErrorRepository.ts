import * as Logger from 'bunyan';
import { SteamError } from './SteamError';
import { IDatabase } from 'pg-promise';

export class SteamErrorRepository {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'ErrorRepository' });
        if (process.env.NODE_ENV === 'test') {
            this._log.level(Logger.FATAL + 1);
        }
    }

    async add(error: SteamError[]): Promise<SteamError> {
        this._log.info('Call to add a new Steam Error');
        return this._db.one(
            `INSERT INTO steam_errors (code, error, message, steam_account_name)
             VALUES ($1, $2, $3, $4)
             RETURNING id, code, error, message, steam_account_name, created_at`,
            error
        );
    }

    async findAll(limit: number, offset: number, userId: number): Promise<SteamError[]> {
        this._log.info('Call to get all Steam Errors');
        return this._db.manyOrNone(
            `SELECT steam_errors.id, code, error, message, steam_account_name,
            steam_errors.created_at FROM steam_errors LEFT JOIN steam_accounts
            ON steam_errors.steam_account_name = steam_accounts.account_name
            WHERE user_id = $3 ORDER BY id DESC LIMIT $1 OFFSET $2`,
            [limit, offset, userId]
        );
    }

    async deleteAllOlderThan(date: Date): Promise<number> {
        this._log.info('Call to delete all Steam Errors Older Than');
        return this._db.oneOrNone(
            `DELETE FROM steam_errors WHERE created_at <= $1`,
            date
        );
    }
}
