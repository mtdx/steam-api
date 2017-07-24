import 'jest';
import { server } from '../../server';
import * as Joi from 'joi';
import { ErrorSchema } from '../../common/schema';
import { SteamGroupSchema } from './schema';
import { SteamGroupStatus } from './SteamGroup';
import * as HttpStatus from 'http-status-codes';

const DEFAULT_GROUP_STATUS = SteamGroupStatus[SteamGroupStatus.WORKING];
// tslint:disable-next-line:max-line-length
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwic2NvcGUiOiJ1IiwiaWF0IjoxNTAwNjIwNTc3fQ.4BBabqV0HclzaJ4gHe6VwRHz7gtI_PBlVmCDuyo9P7E';
const GROUP_NAME = 'testgroup';

describe('/api/v1/steam-group route', () => {
  beforeAll(async done => {
    setTimeout(() => {
      done();
    }, 20); // give time for routes to register
  });

  it('POST & GET /api/v1/steam-group -> test no auth -> 401', done => {
    const options1 = {
      method: 'POST',
      url: '/api/v1/steam-group',
      payload: {
        group_link: GROUP_NAME,
      }
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
      url: '/api/v1/steam-group',
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

  it('POST & DELETE /api/v1/steam-group -> created & deleted', done => {
    const options1 = {
      method: 'POST',
      url: '/api/v1/steam-group',
      headers: { Authorization: AUTH_TOKEN },
      payload: {
        group_link: GROUP_NAME,
      }
    };
    server.inject(options1, response1 => {
      const steamGroup: any = Joi.validate(response1.result, SteamGroupSchema);
      expect(response1.statusCode).toBe(HttpStatus.CREATED);
      expect(steamGroup.value.statusName).toBe(DEFAULT_GROUP_STATUS);
      expect(steamGroup.value.id).toBeDefined();
      expect(steamGroup.value.status).toBeDefined();
      expect(steamGroup.value.group_link).toBeDefined();
      expect(steamGroup.value.group_link).toBeDefined();
      // next test existing group error
      server.inject(options1, response2 => {
        const error: any = Joi.validate(response2.result, ErrorSchema);
        expect(response2.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.error).toBeNull();
        expect(error.value.error).toBe('Duplicate Steam Group');
        expect(error.value.message).toBe('Steam Group Link Already Exists');
      });
      // next test delete
      const options2 = {
        method: 'DELETE',
        url: '/api/v1/steam-group/' + steamGroup.value.id,
        headers: { Authorization: AUTH_TOKEN },
      };
      server.inject(options2, response3 => {
        expect(response3.statusCode).toBe(HttpStatus.OK);
        done();
      });
    });
  });

  it('GET /api/v1/steam-group -> a list of objects', done => {
    const options = {
      method: 'GET',
      url: '/api/v1/steam-group',
      headers: { Authorization: AUTH_TOKEN },
    };
    server.inject(options, response => {
      const steamGroups: any = Joi.array().items(SteamGroupSchema).validate(response.result);
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(steamGroups.error).toBeNull();
      expect(steamGroups.value.length).toBeGreaterThanOrEqual(2); // from seed
      done();
    });
  });

  afterAll(() => {
    server.stop();
  });

});
