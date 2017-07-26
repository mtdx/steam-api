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

const UPDATED_ACCOUNT_NAME = 'updatedsteamaccount';
const UPDATED_ACCOUNT_PASSWORD = 'u8xjcEf2nrq"#uv';
const UPDATED_IDENTITY_SECRET = 'dsm&T*2auDEdu3Rj"NN:h!_(fN[2rgRTwkDe';
const UPDATED_SHARED_SECRET = 'b3QLLsyaVZZ-M8rtM+?Aj5eD,k}&d5##\WR:';

describe('/api/v1/steam-account route', () => {

  // give time for routes to register
  beforeAll(async done => setTimeout(() => done(), 20));

  it('POST /api/v1/steam-account -> test no auth -> 401', done => {
    const options = {
      method: 'POST',
      url: '/api/v1/steam-account'
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

  it('GET /api/v1/steam-account -> test no auth -> 401', done => {
    const options = {
      method: 'GET',
      url: '/api/v1/steam-account',
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

  it('DELETE /api/v1/steam-account/1 -> test no auth -> 401', done => {
    const options = {
      method: 'DELETE',
      url: '/api/v1/steam-account/1',
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

  it('POST /api/v1/steam-account/1 -> test no auth -> 401', done => {
    const options = {
      method: 'POST',
      url: '/api/v1/steam-account/1',
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

  it('POST & UPDATE & DELETE /api/v1/steam-account -> created & updated & deleted', done => {
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
      expect(steamAccount.value.role).toBe(SteamAccountRole.INVITE); // default role
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

      // next test update account error
      const options2 = {
        method: 'POST',
        url: '/api/v1/steam-account/' + steamAccount.value.id,
        headers: { Authorization: AUTH_TOKEN },
        payload: {
          role: SteamAccountRole.PRICE, // updated role
          account_name: UPDATED_ACCOUNT_NAME,
          account_password: UPDATED_ACCOUNT_PASSWORD,
          identity_secret: UPDATED_IDENTITY_SECRET,
          shared_secret: UPDATED_SHARED_SECRET,
        }
      };
      server.inject(options2, response3 => {
        const updatedSteamAccount: any = Joi.validate(response3.result, SteamAccountSchema);
        expect(response3.statusCode).toBe(HttpStatus.OK);
        expect(updatedSteamAccount.value.id).toBeGreaterThan(0);
        expect(updatedSteamAccount.value.status).toBe(SteamAccountStatus.IDLE); // default status
        expect(updatedSteamAccount.value.role).toBe(SteamAccountRole.PRICE); // updated role
        expect(updatedSteamAccount.value.account_name).toBe(UPDATED_ACCOUNT_NAME);
        expect(updatedSteamAccount.value.account_password).toBe(UPDATED_ACCOUNT_PASSWORD);
        expect(updatedSteamAccount.value.identity_secret).toBe(UPDATED_IDENTITY_SECRET);
        expect(updatedSteamAccount.value.shared_secret).toBe(UPDATED_SHARED_SECRET);

        // next test delete
        const options3 = {
          method: 'DELETE',
          url: '/api/v1/steam-account/' + steamAccount.value.id,
          headers: { Authorization: AUTH_TOKEN },
        };
        server.inject(options3, response4 => {
          const success: any = Joi.validate(response4.result, SuccessSchema);
          expect(response4.statusCode).toBe(HttpStatus.OK);
          expect(success.error).toBeNull();
          expect(success.value.id).toBe(steamAccount.value.id);
          done();
        });
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

  afterAll(async done => {
    await server.stop();
    done();
  });

});
