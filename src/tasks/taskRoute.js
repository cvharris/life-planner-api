'use strict'

module.exports = function (server, taskController) {
  const ctrl = taskController
  const root = 'task'

  server.route({
    method: 'GET',
    path: `/${root}`,
    handler: ctrl.list
  })
  server.route({
    method: 'GET',
    path: `/${root}/{taskId}`,
    handler: ctrl.getTask
  })
  server.route({
    method: 'PATCH',
    path: `/${root}/{taskId}`,
    handler: ctrl.patch
  })
  server.route({
    method: 'PUT',
    path: `/${root}/{taskId}`,
    handler: ctrl.deactivateTask
  })
  server.route({
    method: 'POST',
    path: `/${root}`,
    handler: ctrl.create
  })
}
