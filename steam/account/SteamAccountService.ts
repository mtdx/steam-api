import * as Logger from 'bunyan';
import { SteamGroup, SteamGroupStatus } from './SteamGroup';
import { IDatabase } from 'pg-promise';

export class SteamGroupService {
    protected _log: Logger;

    constructor(protected _db: IDatabase<any>, _log: Logger) {
        this._log = _log.child({ service: 'GroupService' });
    }

}