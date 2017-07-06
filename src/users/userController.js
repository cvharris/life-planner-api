"use strict";

const co = require('co')
const _ = require('lodash')

module.exports = function (User, log) {

  return {
		list: co.wrap(list),
    update: co.wrap(update),
    deleteUser: co.wrap(deleteUser),
    create: co.wrap(create)
  }

  function* list(request, reply) {
    const result = yield User.find().exec()

    reply(result)
	}

	function* create(request, reply) {
    const user = new User({
      firstName: request.payload.firstName,
      lastName: request.payload.lastName,
      email: request.payload.email,
    })

    const result = user.save()

    reply(result)
	}

  function* update(request, reply) {
    reply('updating user')
  }

  function* deleteUser(request, reply) {
    reply(`application "${request.params.userId}" deleted!`)
  }
}
