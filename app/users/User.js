'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

module.exports = function () {

  const schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
  }, {
    collection: 'Users',
    timestamps: true
  })

  schema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    hashField: 'password',
    usernameLowerCase: true
  })

  mongoose.model('User', schema)

  return mongoose.model('User')
}
