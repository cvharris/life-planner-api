"use strict";

const co = require('co')
const _ = require('lodash')

module.exports = function grantControllerFactory(Task, log) {

  return {
		list: co.wrap(list),
    update: co.wrap(update),
    deleteEvent: co.wrap(deleteEvent),
    create: co.wrap(create)
  }

  function* list(request, reply) {
    reply('listing all events')
	}

	function* create(request, reply) {
    reply('creating event')
	}

  function* update(request, reply) {
    reply('updating event')
  }

  function* deleteEvent(request, reply) {
    reply(`application "${request.params.name}" deleted!`)
  }
}
