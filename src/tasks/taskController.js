"use strict";

const co = require('co')
const mongoose = require('mongoose')

module.exports = function (Task, log) {

  return {
		list: co.wrap(list),
    update: co.wrap(update),
    deleteTask: co.wrap(deleteTask),
    create: co.wrap(create)
  }

  function* list(request, reply) {
    const result = Task.find().exec()

    reply(result)
	}

	function* create(request, reply) {
    const task = new Task({
      description: request.payload.description,
      _owner: mongoose.Types.ObjectId(request.payload.owner),
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
