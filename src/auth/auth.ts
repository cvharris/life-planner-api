import { IUser, User } from '../users/User'
import { redisClient } from '../conf/redisConnection'
import * as JWT from 'jsonwebtoken'
import koaPassport = require('koa-passport')
import GoogleStrategy = require('passport-google-oauth')
import LocalStrategy = require('passport-local')
import * as JWTPassport from 'passport-jwt'
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
    this.setupToken()
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

  generateToken(user: IUser) {
    const session = {
      id: user._id
    }
    return JWT.sign(session, process.env.JWT_SECRET)
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
          let token = await redisClient.getAsync(user.id)
          if (!token) {
            token = this.generateToken(user)
            await redisClient.setAsync(user.id, JSON.stringify(token))
          }
          return done(null, token)
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
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://${process.env.HOST}:${process.env.PORT}/auth/google/callback`,
      passReqToCallback: true
    }, async (req, token: string, refreshToken: string, profile, done) => {
      // TODO: check req here for user
      const user = await User.findOne({ googleId: profile.id })

      if (user) {

      }
    }))
  }

  setupToken() {
    this.passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
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
