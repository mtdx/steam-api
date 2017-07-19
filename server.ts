import { Server } from 'hapi';
import * as Nes from 'nes';
import * as good from 'good';
import * as hapiAuthJwt from 'hapi-auth-jwt';

import { bunyanReporter } from './server/bunyanReporter';
import { routes } from './server/routes';

const plugins = [{
  register: good,
  options: {
    reporters: {
      bunyan: [ bunyanReporter ]
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
const server = new Server();

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
        verifyOptions: {
            algorithms: [ 'HS256' ],
        }
    });
})
.then(() => server.log('info', 'Plugins registered'))
.then(() => server.route(routes))
.then(() => server.start())
.catch(error => server.log('error', error));
