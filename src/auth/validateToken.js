'use strict'

module.exports = function (redisClient) {
  return function* (decoded, request, callback) {
    let userInfo = yield redisClient.getAsync(decoded.id)

    if (userInfo) {
      callback(null, true)
    } else {
      callback(null, false)
    }

  }
}