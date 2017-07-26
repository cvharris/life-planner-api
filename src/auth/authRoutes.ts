import * as Router from 'koa-router'
import { AuthController, authCtrl } from './authController'

export class AuthRouter {

  ctrl: AuthController
  router: Router

  constructor() {
    this.ctrl = authCtrl
    this.router = new Router()
    this.router.get(`/login`, this.ctrl.login)
    this.router.get('/logout', this.ctrl.logout)
    this.router.post('/auth/google', this.ctrl.authGoogle)
  }
}

export const AuthRoutes = new AuthRouter().router
