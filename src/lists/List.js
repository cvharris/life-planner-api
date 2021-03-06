'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

module.exports = function () {

  const schema = new Schema({
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    
    isRoot: { type: Boolean, default: true },
  }, {
    collection: 'List',
    timestamps: true
  })

  function transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  }

  schema.set('toJSON', { virtuals: true, transform: transform })
  schema.set('toObject', { virtuals: true, transform: transform })

  mongoose.model('List', schema)

  return mongoose.model('List')
}
