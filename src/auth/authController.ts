import { redisClient } from '../conf/redisConnection'
import { GoogleAuthClient } from '../conf/GoogleAuthClient'
import { Context } from 'koa'
import * as aguid from 'aguid'
import { User } from '../users/User'
const JWT = require('jsonwebtoken')
import * as _ from 'lodash'

export class AuthController {

  async login (ctx: Context, next) {
    const session = {
      valid: true, // this will be set to false when the person logs out
      id: aguid(), // a random session id
      exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
    }
    // create the session in Redis
    redisClient.set(session.id, JSON.stringify(session))
    // sign the session as a JWT
    const token = JWT.sign(session, process.env.JWT_SECRET) // synchronous
    console.log(token)

    ctx.body = {text: 'Check Auth Header for your Token'}
    ctx.header['Authorization'] = token
  }

  async logout (ctx: Context, next) {
    // const success = await redisClient.delAsync(ctx.request.auth.credentials.id)

    ctx.body = 'Logged out'
  }

  async register (ctx: Context, next) {
   ctx.body = 'user registered!'
  }

  async authGoogle (ctx: Context, next) {
    GoogleAuthClient.verifyIdToken(ctx.body.idToken, process.env.GOOGLE_CLIENT_ID, async (e, login) => {
      const payload = login.getPayload()

      if (!this.validateToken(payload.aud, payload.iss)) {
        ctx.throw(400, 'token not from authorized resource!')
      }

      const authUser = {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        imageUrl: payload.picture,
        locale: payload.locale,
        googleId: payload.sub
      }

      let user
      user = await User.findOne({ googleId: authUser.googleId })
      if (!user) {
        user = await User.findOne({ email: authUser.email })
        if (!user) {
          user = new User(authUser)
          user = user.save()
        } else {
          _.merge(user, authUser)
          user = user.save()
        }
      }

      const jwt = JWT.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET)

      await redisClient.setAsync(user.id, JSON.stringify({
        id: user.id,
        googleId: authUser.googleId,
        email: authUser.email,
        lifeTask: user.lifeTask,
        sidebarTask: user.sidebarTask
      }))

      ctx.body = user
      ctx.header['Authorization'] = jwt
        // .state('token', jwt)
    })
  }

  validateToken (aud, iss) {
    return aud === process.env.GOOGLE_CLIENT_ID && (iss === 'accounts.google.com' || iss === 'https://accounts.google.com')
  }
}

export const authCtrl = new AuthController()
