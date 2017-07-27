import 'jest';
import { server } from '../../server';
import * as Joi from 'joi';
import { ErrorSchema } from '../../common/schema';
import { SteamErrorSchema, SteamError } from './SteamError';
import * as HttpStatus from 'http-status-codes';
import { SteamErrorRepository } from './SteamErrorRepository';
import { db } from '../../server';
import * as bunyan from 'bunyan';

// tslint:disable-next-line:max-line-length
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwic2NvcGUiOiJ1IiwiaWF0IjoxNTAwNjIwNTc3fQ.4BBabqV0HclzaJ4gHe6VwRHz7gtI_PBlVmCDuyo9P7E';
const log = bunyan.createLogger({ name: 'steamerror' });

describe('/api/v1/steam-error route', () => {

    // give time for routes to register
    beforeAll(async done => setTimeout(() => done(), 20));

    // joint with accounts to get by current users and remove user_id
    it('#add() & #delete() a steam error', async done => {
        const ERROR_CODE = 400;
        const ERROR_NAME = 'Error Name';
        const ERROR_MESSAGE = 'Error Message';
        const STEAM_ACCOUNT_NAME = 'csgoninjastorage64'; // from seed.

        const steamErrorRepository: SteamErrorRepository = new SteamErrorRepository(db, log);
        const steamErrorAdd: any[] = [
            ERROR_CODE,
            ERROR_NAME,
            ERROR_MESSAGE,
            STEAM_ACCOUNT_NAME
        ];
        const steamError: SteamError = await steamErrorRepository.add(steamErrorAdd);
        expect(steamError).toBeDefined();
        expect(steamError.code).toBe(ERROR_CODE);
        expect(steamError.error).toBe(ERROR_NAME);
        expect(steamError.message).toBe(ERROR_MESSAGE);
        expect(steamError.steam_account_name).toBe(STEAM_ACCOUNT_NAME);
        done();
    });

    it('GET /api/v1/steam-error -> test no auth -> 401', done => {
        const options = {
            method: 'GET',
            url: '/api/v1/steam-error',
        };
        server.inject(options, response => {
            const error: any = Joi.validate(response.result, ErrorSchema);
            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(error.error).toBeNull();
            expect(error.value.error).toBe('Unauthorized');
            expect(error.value.message).toBe('Missing authentication');
            done();
        });
    });

    it('GET /api/v1/steam-error -> a list of objects', done => {
        const options = {
            method: 'GET',
            url: '/api/v1/steam-error',
            headers: { Authorization: AUTH_TOKEN },
        };
        server.inject(options, async response => {
            const steamErrors: any = Joi.array().items(SteamErrorSchema).validate(response.result);
            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(steamErrors.error).toBeNull();
            expect(steamErrors.value.length).toBeGreaterThanOrEqual(1); // from seed

            // now we detele
            const steamErrorRepository: SteamErrorRepository = new SteamErrorRepository(db, log);
            await steamErrorRepository.deleteAllOlderThan(new Date());
            const steamErrors2: SteamError[] = await steamErrorRepository.findAll(20, 0, 1);
            expect(steamErrors2.length).toBe(0);
            done();
        });
    });

    afterAll(async done => {
        await server.stop();
        done();
    });

});
