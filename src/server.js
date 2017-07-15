'use strict'

const co = require('co')
const good = require('good')
const Boom = require('boom')
require('dotenv').config()
const JWT = require('jsonwebtoken')
const url = require('url')
const redis = require('redis')

// Log ops info very rarely when running locally. Time is in milliseconds.
const monitoringInterval = process.env.ENV === 'prod' ? 60 * 1000 : 60 * 60 * 1000

module.exports = function (log, validateToken, redisClient) {

  const Hapi = require('hapi');
  const server = new Hapi.Server();

  server.connection({
    port: process.env.PORT,
    host: process.env.HOST,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    routes: {
      cors: {
        headers: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type', 'If-None-Match', 'enctype'],
        exposedHeaders: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type'],
        credentials: true
      }
    }
  })

  co.wrap(function* () {
    yield server.register([
      require('inert'),
      require('hapi-auth-jwt2'),
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

    server.auth.strategy('jwt', 'jwt', true, {
      key: process.env.JWT_SECRET,  
      validateFunc: co.wrap(validateToken),
      verifyOptions: {
        ignoreExpiration: true
      }
    });

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
