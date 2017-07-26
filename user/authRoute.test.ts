import 'jest';
import { server } from '../server';
import * as Joi from 'joi';
import { ErrorSchema, TokenSchema } from '../common/schema';
import * as HttpStatus from 'http-status-codes';

describe('/api/v1/auth route & / login', () => {

  // give time for routes to register
  beforeAll(async done => setTimeout(() => done(), 20));

  it('POST /api/v1/auth -> get token -> GET / & success login -> 200', done => {
    const options1 = {
      method: 'POST',
      url: '/api/v1/auth',
      payload: {
        username: 'admin',
        password: 'e3TPs9aSShhRwG3B'
      }
    };
    server.inject(options1, response1 => {
      const auth: any = Joi.validate(response1.result, TokenSchema);
      expect(response1.statusCode).toBe(HttpStatus.OK);
      expect(auth.error).toBeNull();
      expect(auth.value.token).toBeDefined();
      // next login
      const options2 = {
        method: 'GET',
        url: '/api/v1',
        headers: { Authorization: 'Bearer ' + auth.value.token }
      };
      server.inject(options2, response2 => {
        expect(response2.statusCode).toBe(HttpStatus.OK);
        done();
      });
    });
  });

  it('POST /api/v1/auth & fails login -> 401', done => {
    const options = {
      method: 'POST',
      url: '/api/v1/auth',
      payload: {
        username: 'fakeadmin',
        password: 'fakepassword'
      },
    };
    server.inject(options, response => {
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      const error: any = Joi.validate(response.result, ErrorSchema);
      expect(error.error).toBeNull();
      expect(error.value.error).toBe('Authentication Failed');
      expect(error.value.message).toBe('Invalid Username or Password');
      done();
    });
  });

  it('GET /api/v1 & fail login (no/bad token) -> 400', done => {
    const options = {
      method: 'GET',
      url: '/api/v1',
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
    };
    server.inject(options, response => {
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      const error: any = Joi.validate(response.result, ErrorSchema);
      expect(error.value.error).toBe('Bad Request');
      expect(error.value.message).toBe('Bad HTTP authentication header format');
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      done();
    });
  });

  afterAll(async done => {
    await server.stop();
    done();
  });

});
