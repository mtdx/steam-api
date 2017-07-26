import * as Logger from 'bunyan';
import { SteamGroup, SteamGroupStatus } from './SteamGroup';
import { IDatabase } from 'pg-promise';

export class SteamGroupRepository {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'GroupService' });
        if (process.env.NODE_ENV === 'test') {
            this._log.level(Logger.FATAL + 1);
        }
    }

    async findByGroupLink(groupLink: string, userId: number): Promise<SteamGroup> {
        this._log.info('Call to find group by group link.');
        return this._db.oneOrNone(
            `SELECT * FROM steam_groups WHERE group_link = $1 AND user_id = $2`,
            [groupLink, userId]
        );
    }

    async add(status: SteamGroupStatus, groupLink: string, userId: number): Promise<SteamGroup> {
        this._log.info('Call to add a new Steam Group');
        return this._db.one(
            `INSERT INTO steam_groups (status, group_link, user_id) VALUES ($1, $2, $3)
             RETURNING id, status, group_link, created_at`,
            [status, groupLink, userId]
        );
    }

    async delete(id: number, userId: number): Promise<number> {
        this._log.info('Call to delete a Steam Group');
        return this._db.oneOrNone(
            `DELETE FROM steam_groups WHERE id = $1 AND user_id = $2 RETURNING id`,
            [id, userId]
        );
    }

    async findAll(limit: number, offset: number, userId: number): Promise<SteamGroup[]> {
        this._log.info('Call to get all Steam Groups');
        return this._db.manyOrNone(
            `SELECT id, status, group_link, created_at FROM steam_groups
            WHERE user_id = $3 ORDER BY id DESC LIMIT $1 OFFSET $2`,
            [limit, offset, userId]
        );
    }
}
