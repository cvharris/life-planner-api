import { redisClient } from '../conf/redisConnection'
import { GoogleAuthClient } from '../conf/GoogleAuthClient'
import { Context } from 'koa'
import * as aguid from 'aguid'
import { User } from '../users/User'
import JWT = require('jsonwebtoken')
import * as _ from 'lodash'

export class AuthController {

  async login (ctx: Context, next) {
    const session = {
      id: ctx.state.user.id,
      googleId: ctx.state.user.googleId,
      email: ctx.state.user.email,
      lifeTask: ctx.state.user.lifeTask,
      sidebarTask: ctx.state.user.sidebarTask
    }
    // create the session in Redis
    await redisClient.setAsync(session.id, JSON.stringify(session))
    // sign the session as a JWT

    const token = JWT.sign(session, process.env.JWT_SECRET) // synchronous

    ctx.body = {text: 'Check Auth Header for your Token'}
    ctx.set('Authorization', token)
  }

  async logout (ctx: Context, next) {
    const success = await redisClient.delAsync(ctx.state.user.id)
    if (success) {
      ctx.logout()
      ctx.body = 'Logged out'
    }

  }
}

export const authCtrl = new AuthController()
