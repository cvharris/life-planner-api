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

module.exports = function (log, googleAuthHandler, redisClient) {

  const Hapi = require('hapi');
  const server = new Hapi.Server();

  const validate = function* (decoded, request, callback) {
    // do your checks to see if the session is valid
    redisClient.get(decoded.id, function (err, reply) {
      if(err) {
        return Boom.internal(err)
      }
      var session;
      if(reply) {
        session = JSON.parse(reply);
      }
      else { // unable to find session in redis ... reply is null
        return callback(err, false);
      }

      if (session.valid === true) {
        return callback(err, true);
      }
      else {
        return callback(err, false);
      }
    });
  };

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
      }, {
        register: require('hapi-auth-google'),
        options: {
          REDIRECT_URL: '/auth/google',
          handler: googleAuthHandler,
          access_type: 'online',
          approval_prompt: 'auto',
          scope: 'https://www.googleapis.com/auth/plus.profile.emails.read',
          BASE_URL: `http://${process.env.HOST}:${process.env.PORT}`,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
        }
      }
    ])

    server.auth.strategy('jwt', 'jwt', true, {
      key: process.env.JWT_SECRET,  
      validateFunc: co.wrap(validate),
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
