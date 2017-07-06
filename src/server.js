'use strict'

const co = require('co')
const good = require('good')

// Log ops info very rarely when running locally. Time is in milliseconds.
const monitoringInterval = process.env['ENV'] === 'prod' ? 60 * 1000 : 60 * 60 * 1000

module.exports = function (log) {

  const Hapi = require('hapi');
  const server = new Hapi.Server();

  server.connection({
    port: 4202,
    host: 'localhost',
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    }
  })

  co.wrap(function* () {
    yield server.register([
      require('inert'),
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

    yield server.start()
    log.info('Server started:', {
      uri: server.info.uri
    })

    // Log table of routes
    // const table = server.table()
    // table[0].table.forEach(route => {
    //   console.log(route.method, route.path);
    // })
  })()

  return server
}
