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
    method: 'PUT',
    path: `/${root}/{name}`,
    config: {
      handler: ctrl.update
    }
  })
  server.route({
    method: 'DELETE',
    path: `/${root}/{name}`,
    config: {
      handler: ctrl.deleteEvent
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
