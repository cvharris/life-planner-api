'use strict'

const redis = require('redis')
require('dotenv').config()
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = function (log) {
  const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL)
  client.auth(process.env.REDIS_PASSWORD)

  client.on('connect', () => {
    console.log('Connected to redis database')
  })
  return client
}
