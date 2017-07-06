'use strict'

const co = require('co')

module.exports = function(User) {
  return {
    login: co.wrap(login),
    logout: co.wrap(logout),
    register: co.wrap(register)
  }

  function* login(request, reply) {
    reply('logged in!')
  }

  function* logout(request, reply) {
    reply('logged out!')
  }

  function* register(request, reply) {
    reply('user registered!')
  }
}
