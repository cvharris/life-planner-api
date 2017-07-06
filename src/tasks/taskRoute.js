"use strict"

module.exports = function (server, taskController) {
  const ctrl = taskController
  const root = 'task'

  server.route({
    method: 'GET',
    path: `/${root}`,
    config: {
      handler: ctrl.list
    }
  })
  server.route({
    method: 'PATCH',
    path: `/${root}/{taskId}`,
    config: {
      handler: ctrl.patch
    }
  })
  server.route({
    method: 'DELETE',
    path: `/${root}/{taskId}`,
    config: {
      handler: ctrl.deleteTask
    }
  })
  server.route({
    method: 'POST',
    path: `/${root}`,
    config: {
      handler: ctrl.create
    }
  })
}
