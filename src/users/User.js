'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

module.exports = function (Task) {
  const schema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    lifeTask: {
      type: ObjectId,
      required: true,
      ref: 'Task',
      default: new Task({
        description: 'All Tasks',
        owner: this._id,
        canComplete: false
      })
    },
    sidebarTask: {
      type: ObjectId,
      required: true,
      ref: 'Task',
      default: new Task({
        description: 'Sidebar',
        owner: this._id,
        canComplete: false
      })
    },
    imageUrl: String,
    locale: String,
    googleId: String
  }, {
    collection: 'Users',
    timestamps: true
  })

  function transform (doc, ret) {
    delete ret.__v
    delete ret._id
    return ret
  }

  schema.set('toJSON', { virtuals: true, transform: transform })
  schema.set('toObject', { virtuals: true, transform: transform })

  mongoose.model('User', schema)

  return mongoose.model('User')
}
