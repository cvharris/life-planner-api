"use strict"

module.exports = function (server, userController) {
  const ctrl = userController
  const root = 'user'

  server.route({
    method: 'GET',
    path: `/${root}`,
    config: {
      handler: ctrl.list
    }
  })
  server.route({
    method: 'PUT',
    path: `/${root}/{userId}`,
    config: {
      handler: ctrl.update
    }
  })
  server.route({
    method: 'DELETE',
    path: `/${root}/{userId}`,
    config: {
      handler: ctrl.deleteUser
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
