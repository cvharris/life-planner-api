'use strict'

const co = require('co')
const JWT = require('jsonwebtoken')

module.exports = function(User, redisClient) {
  return {
    login: co.wrap(login),
    logout: co.wrap(logout),
    register: co.wrap(register)
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
    reply('logged out!')
  }

  function* register(request, reply) {
    reply('user registered!')
  }
}
