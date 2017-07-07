"use strict";

const co = require('co')
const mongoose = require('mongoose')
const _ = require('lodash')
const Boom = require('boom')

module.exports = function (Task, log) {

  return {
		list: co.wrap(listTasks),
    patch: co.wrap(patchTask),
    deleteTask: co.wrap(deleteTask),
    create: co.wrap(createTask)
  }

  function* listTasks(request, reply) {
    const result = yield Task.find()

    reply(result)
	}

	function* createTask(request, reply) {
    const treatedTask = request.payload
    treatedTask._owner = mongoose.Types.ObjectId(treatedTask.owner)
    delete treatedTask.owner

    const task = new Task(treatedTask)

    let result 
    try {
      result = yield task.save()
    } catch (e) {
      return reply(Boom.badRequest(e))
    }

    reply(result)
	}

  function* patchTask(request, reply) {
    const task = yield Task.findById(request.params.taskId)
    _.extend(task, request.payload)    

    const result = yield task.save()

    reply(result)
  }

  function* deleteTask(request, reply) {
    yield Task.findByIdAndRemove(request.params.taskId)

    reply(`Task ${request.params.taskId} deleted!`).code(204)
  }
}
