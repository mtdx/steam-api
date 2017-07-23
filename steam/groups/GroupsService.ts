import * as Logger from 'bunyan';
import { SteamGroup } from './SteamGroup';
import { IDatabase } from 'pg-promise';

export class UsGroupsService {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'GroupsService' });
    }

    async findByUsernameAndPassword(username: string, password: string): Promise<SteamGroup> {
      //  this._log.info('Request to get user by username and password.');
        return this._db.oneOrNone(
            'SELECT * FROM steam_groups WHERE username = $1 AND password = $2',
            [username, password]
        );
    }
}
