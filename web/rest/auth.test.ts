import 'jest';
import { server } from '../../server';
import * as Joi from 'joi';
import { ErrorSchema, TokenSchema } from '../../common/schema';

describe('/auth route & / login', () => {
  let auth: any;

  beforeAll(async done => {
    setTimeout(() => {
      done();
    }, 20);
  });

  beforeAll(async done => {
    const options = {
      method: 'POST',
      url: '/auth',
      payload: {
        username: 'admin',
        password: 'e3TPs9aSShhRwG3B'
      }
    };
    server.inject(options, response => {
      auth = Joi.validate(response.result, TokenSchema);
      expect(response.statusCode).toBe(200);
      expect(auth.error).toBeNull();
      expect(auth.value.statusCode).toBe(200);
      expect(auth.value.token).toBeDefined();
      done();
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

  it('GET / & success login -> 200', async done => {
    const options = {
      method: 'GET',
      url: '/',
      headers: { Authorization: 'Bearer ' + auth.value.token }
    };
    server.inject(options, response => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  afterAll(async done => {
    server.stop();
    done();
  });
});
