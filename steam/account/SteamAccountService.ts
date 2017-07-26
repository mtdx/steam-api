import * as Logger from 'bunyan';
import { SteamAccount } from './SteamAccount';
import { IDatabase } from 'pg-promise';

export class SteamAccountService {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'SteamAccountService' });
    }

    async findByAccountName(accountName: string, userId: number): Promise<SteamAccount> {
        this._log.info('Call to find a Steam Account by accountn ame.');
        return this._db.oneOrNone(
            `SELECT * FROM steam_accounts WHERE account_name = $1 AND user_id = $2`,
            [accountName, userId]
        );
    }

    async add(account: SteamAccount[]): Promise<SteamAccount> {
        this._log.info('Call to add a new Steam Account');
        return this._db.one(
            `INSERT INTO steam_accounts
            (status, role, account_name, account_password, identity_secret, shared_secret, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, status, role, account_name, account_password, identity_secret, shared_secret, created_at`,
            account
        );
    }

    async delete(id: number, userId: number): Promise<number> {
        this._log.info('Call to delete a Steam Account');
        return this._db.oneOrNone(
            `DELETE FROM steam_accounts WHERE id = $1 AND user_id = $2 RETURNING id`,
            [id, userId]
        );
    }

    async findAll(limit: number, offset: number, userId: number): Promise<SteamAccount[]> {
        this._log.info('Call to get all Steam Accounts');
        return this._db.manyOrNone(
            `SELECT id, status, role, account_name, account_password, identity_secret, shared_secret, created_at
             FROM steam_accounts WHERE user_id = $3 ORDER BY id DESC LIMIT $1 OFFSET $2`,
            [limit, offset, userId]
        );
    }
}
