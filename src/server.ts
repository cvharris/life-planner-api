import { TaskRoutes } from './tasks/taskRoute'
import { AuthRoutes } from './auth/authRoutes'
import { MongoConnection } from './conf/connectMongoose'
import { UserRoutes } from './users/userRoute'
import { passport } from './auth/auth'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { errorHandler } from './conf/errorHandler'
import * as  pino from 'koa-pino-logger'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import cors = require('kcors')

class Server {

  koa: Koa

  constructor() {
    let koa = new Koa()
    koa = this.middleware(koa)
    koa = this.auth(koa)
    koa = this.routes(koa)
    this.koa = koa
  }

  private middleware(koa: Koa) {
    koa.use(errorHandler)
      .use(bodyParser())
      .use(logger())
      // .use(pino({
      //   prettyPrint: {
      //     timeTransOnly: true,
      //     levelFirst: true,
      //     forceColor: true
      //   },
      //   serializers: {
      //     req: (req) => {
      //       return {
      //         method: req.method,
      //         url: req.url,
      //       }
      //     },
      //     res: (res) => {
      //       return {
      //         code: res.statusCode,
      //       }
      //     }
      //   }
      // }))
      .use(cors({
        origin: '*',
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type', 'If-None-Match', 'enctype', 'X-Requested-With'],
        exposeHeaders: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type'],
        credentials: true
      }))
      return koa
  }

  private auth(koa: Koa) {
    koa.use(passport.initialize())
    return koa
  }

  private routes(koa: Koa) {
    const router = new Router()
    const api = new Router()

    api.use(AuthRoutes.routes())
    api.use(UserRoutes.routes())
    api.use(TaskRoutes.routes())

    router.use('/api', api.routes())
    koa.use(router.routes())
    koa.use(router.allowedMethods())
    return koa
  }
}

export const App = new Server().koa
