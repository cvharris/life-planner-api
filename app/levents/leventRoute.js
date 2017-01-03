"use strict"

module.exports = function (server, leventController) {
  const ctrl = leventController
  const root = 'levent'

  server.route({
    method: 'GET',
    path: `/${root}`,
    config: {
      auth: { mode: 'try', strategy: 'session' }, // or simply 'session'
      handler: ctrl.list
    }
  })
  server.route({
    method: 'GET',
    path: `/${root}/{name}`,
    config: {
      auth: { mode: 'try', strategy: 'session' }, // or simply 'session'
      handler: ctrl.download
    }
  })
  server.route({
    method: 'DELETE',
    path: `/${root}/{name}`,
    config: {
      auth: { mode: 'try', strategy: 'session' }, // or simply 'session'
      handler: ctrl.deleteApplication
    }
  })
  server.route({
    method: 'POST',
    path: `/${root}`,
    config: {
      auth: { mode: 'try', strategy: 'session' }, // or simply 'session'
      handler: ctrl.upload,
      payload: {
        output: 'stream',
        maxBytes: 1048576 * 10
      }
    }
  })
}
