import { IUser, User } from '../users/User'
import { redisClient } from '../conf/redisConnection'
import { Task } from '../tasks/Task'
import * as JWT from 'jsonwebtoken'
import koaPassport = require('koa-passport')
import * as JWTPassport from 'passport-jwt'
import * as _ from 'lodash'
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = JWTPassport.Strategy
const ExtractJwt = JWTPassport.ExtractJwt
require('dotenv').config()

export class PassportBuilder {

  passport

  constructor(passport) {
    this.passport = koaPassport
    this.init()
    this.setupLocalRegistry()
    this.setupLocalLogin()
    this.setupJWTLogin()
    this.setupGoogle()
  }

  init() {
    this.passport.serializeUser((user, done) => {
      done(null, user.id)
    })
    this.passport.deserializeUser(async (id, done) => {
      const user = await redisClient.getAsync(id)
      done(null, user)
    })
  }

  setupLocalRegistry() {
    this.passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req, email: string, password: string, done) => {
      const user = await User.findOne({ email: email.toLowerCase() })

      if (user) {
        // TODO: figure out a way to flash a specific message?
        return done(null, false)
      } else {
        const newUser = new User({
          email: email,
        })
        newUser.password = await newUser.generateHash(password)

        return done(null, await newUser.save())
      }
    }))
  }

  setupLocalLogin() {
    this.passport.use('local-signin', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req, email: string, password: string, done) => {
      const user = await User.findOne({email: email.toLowerCase() })

      if (user) {
        if (user.validPassword) {
          return done(null, user)
        }
        // user found but wrong password
        return done(null, false)
      } else {
        // user not found so needs to register
        return done(null, false)
      }
    }))
  }

  setupGoogle() {
    this.passport.use('google', new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CLIENT_URL,
    }, async (token, refreshToken, profile, done) => {
      // TODO: save access token and refreshToken
      let user = await User.findOne({ googleId: profile.id })

      if (user) {
        return done(null, user)
      } else {
        const accountEmail = profile.emails.filter(email => email.type === 'account')[0].value
        user = await User.findOne({ email: accountEmail })

        const authUser = {
          firstName: profile.name.given_name,
          lastName: profile.name.family_name,
          email: accountEmail,
          imageUrl: profile.photos[0].value,
          googleId: profile.id
        }

        if (!user) {
          user = new User(authUser)
          const lifeTask = new Task({
            _id: user.lifeTask,
            description: 'All Tasks',
            owner: user._id,
            canComplete: false
          })
          user.lifeTask = await lifeTask.save()

          const sideTask = new Task({
            _id: user.sidebarTask,
            description: 'Sidebar',
            owner: user._id,
            canComplete: false
          })
          user.sidebarTask = await sideTask.save()

          user = await user.save()
        } else {
          _.merge(user, authUser)
          user = await user.save()
        }

        return done(null, user)
      }
    }))
  }

  setupJWTLogin() {
    this.passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
      passReqToCallback: true
    }, async (req, payload, done) => {
      const user = await redisClient.getAsync(payload.id)

      if (user) {
        return done(null, JSON.parse(user))
      } else {
        return done(null, false)
      }
    }))
  }

}

export const passport = new PassportBuilder(koaPassport).passport
