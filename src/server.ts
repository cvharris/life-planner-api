import { TaskRoutes } from './tasks/taskRoute'
import { AuthRoutes } from './auth/authRoutes'
import { MongoConnection } from './conf/connectMongoose'
import { UserRoutes } from './users/userRoute'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { errorHandler } from './conf/errorHandler'
import * as koaLogger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
// require('dotenv').config()
// const JWT = require('jsonwebtoken')
// const url = require('url')
// const redis = require('redis')

class Server {

  public koa: Koa

  constructor() {
    this.koa = new Koa()
    this.middleware()
    this.routes()
  }

  private middleware() {
    this.koa.use(errorHandler)
      .use(bodyParser())
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

  // server.connection({
  //   port: process.env.PORT,
  //   host: process.env.HOST,
  //   router: {
  //     isCaseSensitive: false,
  //     stripTrailingSlash: true
  //   },
  //   routes: {
  //     cors: {
  //       headers: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type', 'If-None-Match', 'enctype'],
  //       exposedHeaders: ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type'],
  //       credentials: true
  //     }
  //   }
  // })

    // server.auth.strategy('jwt', 'jwt', true, {
    //   key: process.env.JWT_SECRET,
    //   validateFunc: co.wrap(validateToken),
    //   verifyOptions: {
    //     ignoreExpiration: true
    //   }
    // });

    // yield server.start()
    // log.info('Server started:', {
    //   uri: server.info.uri
    // })
}

export const App = new Server().koa
