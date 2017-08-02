import { TaskRoutes } from './tasks/taskRoute'
import { AuthRoutes } from './auth/authRoutes'
import { MongoConnection } from './conf/connectMongoose'
import { UserRoutes } from './users/userRoute'
import { passport } from './auth/auth'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { errorHandler } from './conf/errorHandler'
import * as koaLogger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import cors = require('kcors')
// require('dotenv').config()
// const JWT = require('jsonwebtoken')
// const url = require('url')
// const redis = require('redis')

class Server {

  koa: Koa

  constructor() {
    this.koa = new Koa()
    this.middleware()
    this.auth()
    this.routes()
  }

  private middleware() {
    this.koa.use(errorHandler)
      .use(bodyParser())
      .use(koaLogger())
      .use(cors({
        origin: '*',
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type', 'If-None-Match', 'enctype'],
        exposeHeaders: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type'],
        credentials: true
      }))
  }

  private auth() {
    this.koa.use(passport.initialize())
  }

  private routes() {
    const router = new Router()
    const api = new Router()

    api.use(AuthRoutes.routes())
    api.use(UserRoutes.routes())
    api.use(TaskRoutes.routes())

    router.use('/api', api.routes())
    this.koa.use(router.routes())
    this.koa.use(router.allowedMethods())
  }

    // server.auth.strategy('jwt', 'jwt', true, {
    //   key: process.env.JWT_SECRET,
    //   validateFunc: co.wrap(validateToken),
    //   verifyOptions: {
    //     ignoreExpiration: true
    //   }
    // });
}

export const App = new Server().koa
