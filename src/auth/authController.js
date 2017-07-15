'use strict'

const co = require('co')
const JWT = require('jsonwebtoken')
const Boom = require('boom')
const _ = require('lodash')

module.exports = function(User, redisClient, GoogleAuthClient) {
  return {
    login: co.wrap(login),
    logout: co.wrap(logout),
    register: co.wrap(register),
    authGoogle: co.wrap(authGoogle),
  }

  function* login(request, reply) {
    const session = {
      valid: true, // this will be set to false when the person logs out
      id: aguid(), // a random session id
      exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
    }
    // create the session in Redis
    redisClient.set(session.id, JSON.stringify(session))
    // sign the session as a JWT
    const token = JWT.sign(session, process.env.JWT_SECRET) // synchronous
    console.log(token)

    reply({text: 'Check Auth Header for your Token'})
    .header("Authorization", token);
  }

  function* logout(request, reply) {
    const success = yield redisClient.delAsync(request.auth.credentials.id)

    reply('Logged out')
  }

  function* register(request, reply) {
    reply('user registered!')
  }

  function* authGoogle(request, reply) {
    GoogleAuthClient.verifyIdToken(request.payload.idToken, process.env.GOOGLE_CLIENT_ID, function(e, login) {
      const payload = login.getPayload()

      if (!validateToken(payload.aud, payload.iss)) {
        return reply(Boom.badRequest('token not from authorized resource!'))
      }
      
      const authUser = {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        imageUrl: payload.picture,
        locale: payload.locale,
        googleId: payload.sub,
      }

      let user
      co.wrap(function* () {
        user = yield User.findOne({ googleId: authUser.googleId })
        if (!user) {
          user = yield User.findOne({ email: authUser.email })
          if (!user) {
            user = new User(authUser)
            user = user.save()
          } else {
            _.merge(user, authUser)
            user = user.save()
          }
        }

        const jwt = JWT.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

        yield redisClient.setAsync(user.id, JSON.stringify({
          id: authUser.googleId,
          email: authUser.email
        }))
        return reply(user)
          .header('Authorization', jwt)
          .state('token', jwt);
      }).call()
    })
  }

  function validateToken(aud, iss) {
    return aud === process.env.GOOGLE_CLIENT_ID && (iss === 'accounts.google.com' || iss === 'https://accounts.google.com')
  }
}
