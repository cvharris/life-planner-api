import * as Router from 'koa-router'
import { UserController, userCtrl } from './userController'
import * as passport from 'koa-passport'

export class UserRouter {

  ctrl: UserController
  router: Router

  constructor() {
    this.ctrl = userCtrl
    this.router = new Router()
    this.router.get('/user', passport.authenticate('jwt'), this.ctrl.getOneByAuthToken)
    this.router.get('/user/:userId', passport.authenticate('jwt'), this.ctrl.getOneById)
    this.router.put('/user/:userId', passport.authenticate('jwt'), this.ctrl.update)
    this.router.delete('/user/:userId', passport.authenticate('jwt'), this.ctrl.deleteUser)
    this.router.post('/user', passport.authenticate('jwt'), this.ctrl.create)
  }
}

export const UserRoutes = new UserRouter().router
