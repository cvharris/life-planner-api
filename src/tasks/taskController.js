"use strict";

const co = require('co')
const _ = require('lodash')

module.exports = function (Task, log) {

  return {
		list: co.wrap(list),
    update: co.wrap(update),
    deleteTask: co.wrap(deleteTask),
    create: co.wrap(create)
  }

  function* list(request, reply) {
    reply('listing all Tasks')
	}

	function* create(request, reply) {
    const task = new Task({
      description: request.payload.description,
      owner: request.payload.owner,
    })

    const result = yield task.save()

    reply(result)
	}

  function* update(request, reply) {
    reply('updating Task')
  }

  function* deleteTask(request, reply) {
    reply(`application "${request.params.name}" deleted!`)
  }
}
