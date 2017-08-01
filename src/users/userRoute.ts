import * as Router from 'koa-router'
import { UserController, userCtrl } from './userController'
import * as passport from 'koa-passport'

export class UserRouter {

  ctrl: UserController
  router: Router

  constructor() {
    this.ctrl = userCtrl
    this.router = new Router()
    this.router.get('/user', passport.authenticate('jwt'), this.ctrl.list)
    this.router.get('/user/:userId', this.ctrl.getOneById)
    this.router.put('/user/:userId', this.ctrl.update)
    this.router.delete('/user/:userId', this.ctrl.deleteUser)
    this.router.post('/user', this.ctrl.create)
  }
}

export const UserRoutes = new UserRouter().router
