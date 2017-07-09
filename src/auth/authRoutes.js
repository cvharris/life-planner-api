'use strict';

module.exports = function(server, authController) {
  const ctrl = authController

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      auth: false,
    },
    handler: ctrl.login
  })

  server.route({
    method: 'POST',
    path: '/logout',
    handler: ctrl.logout
  })
}
