import * as Router from 'koa-router'
import { AuthController, authCtrl } from './authController'
import { passport } from './auth'

export class AuthRouter {

  ctrl: AuthController
  router: Router

  constructor() {
    this.ctrl = authCtrl
    this.router = new Router()

    // Main authorization method
    this.router.get('/auth/token', passport.authenticate('jwt'))
    this.router.get('/logout', passport.authenticate('jwt'), this.ctrl.logout)


    this.router.post('/register', passport.authenticate('local-signup', { successRedirect: '/auth/token', failureRedirect: '/401' }))
    this.router.post('/login', passport.authenticate('local-signin', { successRedirect: '/auth/token', failureRedirect: '/401' }))

    this.router.post('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
    this.router.post('/auth/google/callback', passport.authenticate('google', { successRedirect: '/auth/token', failureRedirect: '/401' }))
  }
}

export const AuthRoutes = new AuthRouter().router
