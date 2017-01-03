'use strict';

module.exports = function(server, authController) {
  const ctrl = authController

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      handler: ctrl.login
    }
  })
}
