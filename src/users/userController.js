'use strict'

const co = require('co')
const _ = require('lodash')

module.exports = function (User, log) {
  return {
    list: co.wrap(list),
    update: co.wrap(update),
    deleteUser: co.wrap(deleteUser),
    create: co.wrap(create),
    getOneByAuthToken: co.wrap(getOneByAuthToken)
  }

  function * list (request, reply) {
    const result = yield User.find()

    reply(result)
  }

  function * create (request, reply) {
    const user = new User({
      firstName: request.payload.firstName,
      lastName: request.payload.lastName,
      email: request.payload.email
    })

    const result = user.save()

    reply(result)
  }

  function * update (request, reply) {
    const user = yield User.findByIdAndUpdate(request.params.userId, request.payload, { new: true })

    reply(user)
  }

  function * deleteUser (request, reply) {
    reply(`application "${request.params.userId}" deleted!`)
  }

  function * getOneByAuthToken (request, reply) {
    const user = yield User.findById(request.auth.credentials.id)
      .populate('lifeTask')

    reply(user)
  }
}
