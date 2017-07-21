import 'jest';
import { server } from '../../server';

describe('Basic HTTP /auth route', () => {
  it('returns 401 HTTP status code', done => {
    const options = { method: 'POST', url: '/auth' };
    server.inject(options, response => {
      expect(response.statusCode).toBe(401);
      server.stop();
      done();
    });
  });
});
