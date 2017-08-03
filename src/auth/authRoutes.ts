import * as Router from 'koa-router'
import { AuthController, authCtrl } from './authController'
import * as passport from 'koa-passport'

export class AuthRouter {

  ctrl: AuthController
  router: Router

  constructor() {
    this.ctrl = authCtrl
    this.router = new Router()

    // Main authorization method
    this.router.get('/auth/token', passport.authenticate('jwt'), this.ctrl.login)
    this.router.get('/logout', passport.authenticate('jwt'), this.ctrl.logout)


    this.router.post('/register', passport.authenticate('local-signup', { successRedirect: '/api/auth/token', failureRedirect: '/401' }))
    this.router.post('/login', passport.authenticate('local-signin', { successRedirect: '/api/auth/token', failureRedirect: '/401' }))

    this.router.get('/auth/google', passport.authenticate('google', { failWithError: true, accessType: 'offline', prompt: 'consent', approvalPrompt: 'force' }), this.ctrl.login)
  }
}

export const AuthRoutes = new AuthRouter().router
