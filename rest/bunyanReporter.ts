import * as bunyan from 'bunyan';
import safeStringify from 'fast-safe-stringify';

const withTag = (tag, data) => [data, `[${tag}]`];

export const bunyanReporter = {
  module: 'good-bunyan',
  args: [{
    ops: '*',
    log: '*',
    request: '*',
    response: '*',
    error: '*'
  }, {
    logger: bunyan.createLogger({ name: 'server' }),

    formatters: {
      ops: payload => withTag('ops', {
        memory: payload.proc.mem.rss,
        uptime: payload.proc.uptime,
        load: payload.os.load
      }),

      response: payload => {
        let reqPayload;
        let resPayload;

        if (payload.requestPayload) {
          if (typeof payload.requestPayload === 'object' || Array.isArray(payload.requestPayload)) {
            reqPayload = safeStringify(payload.requestPayload);
          }
        }

        if (payload.responsePayload) {
          if (typeof payload.responsePayload === 'object' || Array.isArray(payload.responsePayload)) {
            resPayload = safeStringify(payload.responsePayload);
          }
        }

        return withTag('response', {
          instance: payload.instance,
          method: payload.method,
          path: payload.path,
          statusCode: payload.statusCode,
          responseTime: payload.responseTime,
          requestPayload: reqPayload,
          responsePayload: resPayload,
          query: payload.query
        });
      }
    },

    levels: {
      ops: 'info',
      log: 'info',
      request: 'info',
      response: 'info',
      error: 'error'
    }
  }]
};
