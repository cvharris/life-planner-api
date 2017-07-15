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
    method: 'GET',
    path: '/logout',
    handler: ctrl.logout
  })

  server.route({
    method: 'POST',
    path: '/auth/google',
    config: {
      auth: false,
    },
    handler: ctrl.authGoogle,
  })
}
