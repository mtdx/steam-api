import 'jest';
import { server } from '../../server';
import * as Joi from 'joi';
import { ErrorSchema, TokenSchema } from '../../common/schema';

describe('/auth route & / login', () => {
  beforeAll(async done => {
    setTimeout(() => {
      done();
    }, 20); // give time for routes to register
  });

  it('POST /auth -> get token -> GET / & success login -> 200', async done => {
    const options1 = {
      method: 'POST',
      url: '/auth',
      payload: {
        username: 'admin',
        password: 'e3TPs9aSShhRwG3B'
      }
    };
    server.inject(options1, response1 => {
      const auth: any = Joi.validate(response1.result, TokenSchema);
      expect(response1.statusCode).toBe(200);
      expect(auth.error).toBeNull();
      expect(auth.value.statusCode).toBe(200);
      expect(auth.value.token).toBeDefined();
      // -> login
      const options2 = {
        method: 'GET',
        url: '/',
        headers: { Authorization: 'Bearer ' + auth.value.token }
      };
      server.inject(options2, response2 => {
        expect(response2.statusCode).toBe(200);
        done();
      });
    });
  });

  it('POST /auth & fails login -> 401', async done => {
    const options = {
      method: 'POST',
      url: '/auth',
      payload: {
        username: 'fakeadmin',
        password: 'fakepassword'
      },
    };
    server.inject(options, response => {
      expect(response.statusCode).toBe(401);
      const error: any = Joi.validate(response.result, ErrorSchema);
      expect(error.error).toBeNull();
      expect(error.value.statusCode).toBe(401);
      expect(error.value.error).toBe('Authentication Failed');
      expect(error.value.message).toBe('Invalid Username or Password');
      done();
    });
  });

  it('GET / & fail login (no/bad token) -> 400', async done => {
    const options = {
      method: 'GET',
      url: '/',
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
    };
    server.inject(options, response => {
      expect(response.statusCode).toBe(400);
      const error: any = Joi.validate(response.result, ErrorSchema);
      expect(error.value.statusCode).toBe(400);
      expect(error.value.error).toBe('Bad Request');
      expect(error.value.message).toBe('Bad HTTP authentication header format');
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  afterAll(async done => {
    server.stop();
    done();
  });
});
