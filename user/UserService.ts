import * as Logger from 'bunyan';
import { User } from './User';
import { IDatabase } from 'pg-promise';

export class UserService {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'UserService' });
    }

    async findByUsernameAndPassword(username: string, password: string): Promise<User> {
      //  this._log.info('Request to get user by username and password.');
        return this._db.oneOrNone(
            'SELECT id, username, scope FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );
    }
}
