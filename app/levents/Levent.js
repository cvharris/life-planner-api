'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = function () {

  const schema = new Schema({
    shortDescription: String,
    _user: Schema.Types.ObjectId,
    startDate: { type: Date },
    endDate: { type: Date },
    category: String
  }, {
    collection: 'Levents',
    timestamps: true
  })

  function transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  }

  schema.set('toJSON', { virtuals: true, transform: transform })
  schema.set('toObject', { virtuals: true, transform: transform })

  mongoose.model('Levent', schema)

  return mongoose.model('Levent')
}
