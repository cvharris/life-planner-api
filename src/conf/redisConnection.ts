import { RedisClient, Multi, createClient } from 'redis'
require('dotenv').config()
import * as bluebird from 'bluebird'

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    setAsync(key: string, value: string): Promise<void>
    getAsync(key: string): Promise<string>
    delAsync(key: string): Promise<any>
  }
}

export class RedisConnection {
  client: RedisClient

  constructor() {
    const oldClient = createClient(process.env.REDIS_PORT, { host: process.env.REDIS_URL })
    bluebird.promisifyAll(Multi.prototype)
    this.client = bluebird.promisifyAll(oldClient) as RedisClient
    this.client.auth(process.env.REDIS_PASSWORD)

    this.client.on('connect', () => {
      console.log('Connected to redis database')
    })
  }
}

export const redisClient = new RedisConnection().client
