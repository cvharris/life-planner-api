'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

module.exports = function () {

  const schema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
  }, {
    collection: 'Users',
    timestamps: true
  })

  // schema.plugin(passportLocalMongoose, {
  //   usernameField: 'email',
  //   hashField: 'password',
  //   usernameLowerCase: true
  // })

  function transform(doc, ret) {
    delete ret.__v
    delete ret._id
    return ret
  }

  schema.set('toJSON', { virtuals: true, transform: transform })
  schema.set('toObject', { virtuals: true, transform: transform })

  mongoose.model('User', schema)

  return mongoose.model('User')
}
