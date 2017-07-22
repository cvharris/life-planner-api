'use strict'

const co = require('co')
const mongoose = require('mongoose')
const _ = require('lodash')
const Boom = require('boom')

module.exports = function (Task, log) {
  return {
    list: co.wrap(listTasks),
    patch: co.wrap(patchTask),
    deactivateTask: co.wrap(deactivateTask),
    deleteTask: co.wrap(deleteTask),
    create: co.wrap(createTask),
    getTask: co.wrap(getTask)
  }

  function * getTask (request, reply) {
    let task

    try {
      task = yield Task.findById(request.params.taskId)
      .populate('children')
    } catch (e) {
      return reply(Boom.notFound())
    }

    reply(task)
  }

  function * listTasks (request, reply) {
    const result = yield Task.find({
      isActive: true,
      owner: new mongoose.Types.ObjectId(request.auth.credentials.id)
    })

    reply(result)
  }

  function * createTask (request, reply) {
    const task = new Task(request.payload.newTask)

    let result
    try {
      result = yield task.save()
      const parent = yield Task.findById(request.payload.parent.id)
      parent.children.push(result)
      yield parent.save()
    } catch (e) {
      return reply(Boom.badRequest(e))
    }

    reply(result)
  }

  function * patchTask (request, reply) {
    const task = yield Task.findById(request.params.taskId)
    _.extend(task, request.payload)

    const result = yield task.save()

    reply(result)
  }

  function * deactivateTask (request, reply) {
    const task = yield Task.findByIdAndUpdate(request.params.taskId, { isActive: false }, { new: true })

    reply(task)
  }

  function * deleteTask (request, reply) {
    // TODO: deprecated. Make Service method only
    yield Task.findByIdAndRemove(request.params.taskId)

    reply(`Task ${request.params.taskId} deleted!`).code(204)
  }
}
