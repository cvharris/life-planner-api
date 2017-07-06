"use strict";

const co = require('co')
const mongoose = require('mongoose')
const _ = require('lodash')

module.exports = function (Task, log) {

  return {
		list: co.wrap(listTasks),
    patch: co.wrap(patchTask),
    deleteTask: co.wrap(deleteTask),
    create: co.wrap(createTask)
  }

  function* listTasks(request, reply) {
    const result = Task.find().exec()

    reply(result)
	}

	function* createTask(request, reply) {
    const task = new Task({
      description: request.payload.description,
      _owner: mongoose.Types.ObjectId(request.payload.owner),
    })

    const result = yield task.save()

    reply(result)
	}

  function* patchTask(request, reply) {
    const task = yield Task.findById(request.params.taskId)
    _.extend(task, request.payload)    

    const result = yield task.save()

    reply(result)
  }

  function* deleteTask(request, reply) {
    reply(`application "${request.params.taskId}" deleted!`)
  }
}
