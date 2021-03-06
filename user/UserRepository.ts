import * as Logger from 'bunyan';
import { User } from './User';
import { IDatabase } from 'pg-promise';

export class UserRepository {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'UserRepository' });
        if (process.env.NODE_ENV === 'test') {
            this._log.level(Logger.FATAL + 1);
        }
    }

    async findByUsernameAndPassword(username: string, password: string): Promise<User> {
        this._log.info('Call to find a user by username and password.');
        return this._db.oneOrNone(
            `SELECT * FROM users WHERE username = $1 AND password = $2`,
            [username, password]
        );
    }
}
