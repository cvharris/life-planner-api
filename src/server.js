'use strict'

const co = require('co')
const good = require('good')

// Log ops info very rarely when running locally. Time is in milliseconds.
const monitoringInterval = process.env['ENV'] === 'prod' ? 60 * 1000 : 60 * 60 * 1000

module.exports = function (log) {

  const validate = function (request, username, password, callback) {
    const user = users[username];
    if (!user) {
      return callback(null, false);
    }

    const isValid = password === user.password
    callback(null, isValid, { id: user.id, name: user.name });
  };

  const Hapi = require('hapi');
  const server = new Hapi.Server();

  server.connection({
    port: 4202,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    routes: {
      cors: {
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        credentials: true
      }
    }
  })

  co.wrap(function* () {
    yield server.register([
      require('inert'),
      require('hapi-auth-cookie'),
      require('vision'), {
        register: good,
        options: {
          ops: {
            interval: monitoringInterval
          },
          reporters: {
            winston: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{
                error: '*',
                log: '*',
                ops: '*'
              }]
            }]
          }
        }
      }
    ])

    server.auth.strategy('session', 'cookie', true, {
      password: 'password-that-is-32-characters-long', // cookie secret
      cookie: 'session', // Cookie name
      isSecure: false, // required for non-https applications
      ttl: 24* 60 * 60 * 1000 // Set session to 1 day
    });

    yield server.start()
    log.info('Server started:', {
      uri: server.info.uri
    })
  })()

  return server
}
