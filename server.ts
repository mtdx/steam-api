import { Server } from 'hapi';
import * as Nes from 'nes';
import * as good from 'good';
import * as hapiAuthJwt from 'hapi-auth-jwt';

import { bunyanReporter } from './web/bunyanReporter';
import { routes } from './web/rest';
import { validatejwt } from './web/validatejwt';

const plugins = [{
  register: good,
  options: {
    reporters: {
      bunyan: [bunyanReporter]
    }
  }
},
{
  register: hapiAuthJwt
},
{
  register: Nes
}];

/**
 * Initialize Hapi server
 */
export const server = new Server();

server.connection({
  port: process.env.STEAMAPP_HTTP_PORT || 8080,
  routes: {
    log: true
  }
});

server.register(plugins as any)
  .then(() => {
    server.auth.strategy('token', 'jwt', {
      key: process.env.STEAMAPP_TOKEN_SIGNING_KEY || 'InsecurePrivateKey',
      validateFunc: validatejwt,
      verifyOptions: {
        algorithms: ['HS256'],
      }
    });
  })
  .then(() => server.log('info', 'Plugins registered'))
  .then(() => server.route(routes))
  .then(() => server.start())
  .catch(error => server.log('error', error));
