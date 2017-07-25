import * as Logger from 'bunyan';
import { SteamAccount } from './SteamAccount';
import { IDatabase } from 'pg-promise';

export class SteamAccountService {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'SteamAccountService' });
    }

}
