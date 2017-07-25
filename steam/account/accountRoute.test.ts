import 'jest';
import { server } from '../../server';
import * as Joi from 'joi';
import { ErrorSchema, SuccessSchema } from '../../common/schema';
import { SteamAccountStatus, SteamAccountSchema, SteamAccountRole } from './SteamAccount';
import * as HttpStatus from 'http-status-codes';

// tslint:disable-next-line:max-line-length
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwic2NvcGUiOiJ1IiwiaWF0IjoxNTAwNjIwNTc3fQ.4BBabqV0HclzaJ4gHe6VwRHz7gtI_PBlVmCDuyo9P7E';
const ACCOUNT_NAME = 'steamaccount';
const ACCOUNT_PASSWORD = 'MJ,9[p=NQrBg';
const IDENTITY_SECRET = 'N^h%*>^:euQ#:cUhf}=xg/H99p$Dt>ggM>7*';
const SHARED_SECRET = 'Qkc`&j"vp#J#(=7)WQg&P2yve(*GRz:}JNkh';
// const MESSAGE = '';

describe('/api/v1/steam-account route', () => {
  beforeAll(async done => {
    setTimeout(() => {
      done();
    }, 20); // give time for routes to register
  });

  it('POST & GET /api/v1/steam-account -> test no auth -> 401', done => {
    const options1 = {
      method: 'POST',
      url: '/api/v1/steam-account'
    };
    server.inject(options1, response1 => {
      const error: any = Joi.validate(response1.result, ErrorSchema);
      expect(response1.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.error).toBeNull();
      expect(error.value.error).toBe('Unauthorized');
      expect(error.value.message).toBe('Missing authentication');
      done();
    });

    const options2 = {
      method: 'GET',
      url: '/api/v1/steam-account',
    };
    server.inject(options2, response2 => {
      const error: any = Joi.validate(response2.result, ErrorSchema);
      expect(response2.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.error).toBeNull();
      expect(error.value.error).toBe('Unauthorized');
      expect(error.value.message).toBe('Missing authentication');
      done();
    });
  });

  it('POST & DELETE /api/v1/steam-account -> created & deleted', done => {
    const options1 = {
      method: 'POST',
      url: '/api/v1/steam-account',
      headers: { Authorization: AUTH_TOKEN },
      payload: {
        role: SteamAccountRole.INVITE, // default role
        account_name: ACCOUNT_NAME,
        account_password: ACCOUNT_PASSWORD,
        identity_secret: IDENTITY_SECRET,
        shared_secret: SHARED_SECRET,
      }
    };
    server.inject(options1, response1 => {
      const steamAccount: any = Joi.validate(response1.result, SteamAccountSchema);
      expect(response1.statusCode).toBe(HttpStatus.CREATED);
      expect(steamAccount.value.id).toBeGreaterThan(0);
      expect(steamAccount.value.status).toBe(SteamAccountStatus.IDLE); // default status
      expect(steamAccount.value.role).toBe(SteamAccountRole.INVITE); // default status
      expect(steamAccount.value.account_name).toBe(ACCOUNT_NAME);
      expect(steamAccount.value.account_password).toBe(ACCOUNT_PASSWORD);
      expect(steamAccount.value.identity_secret).toBe(IDENTITY_SECRET);
      expect(steamAccount.value.shared_secret).toBe(SHARED_SECRET);
      // next test existing account error
      server.inject(options1, response2 => {
        const error: any = Joi.validate(response2.result, ErrorSchema);
        expect(response2.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.error).toBeNull();
        expect(error.value.error).toBe('Duplicate Steam Account');
        expect(error.value.message).toBe('Steam Account Already Exists');
      });
      // next test delete
      const options2 = {
        method: 'DELETE',
        url: '/api/v1/steam-account/' + steamAccount.value.id,
        headers: { Authorization: AUTH_TOKEN },
      };
      server.inject(options2, response3 => {
        const success: any = Joi.validate(response3.result, SuccessSchema);
        expect(response3.statusCode).toBe(HttpStatus.OK);
        expect(success.error).toBeNull();
        expect(success.value.id).toBe(steamAccount.value.id);
        done();
      });
    });
  });

  it('GET /api/v1/steam-account -> a list of objects', done => {
    const options = {
      method: 'GET',
      url: '/api/v1/steam-account',
      headers: { Authorization: AUTH_TOKEN },
    };
    server.inject(options, response => {
      const steamAccounts: any = Joi.array().items(SteamAccountSchema).validate(response.result);
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(steamAccounts.error).toBeNull();
      expect(steamAccounts.value.length).toBeGreaterThanOrEqual(2); // from seed
      done();
    });
  });

  afterAll(async () => {
    await server.stop();
  });

});
