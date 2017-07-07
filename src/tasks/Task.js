'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = function () {

  const schema = new Schema({
    description: {
      type: String,
      required: true,
    },
    _owner: {
      type: Schema.Types.ObjectId,
      required: true
    },
    _assignedTo: [ Schema.Types.ObjectId ],
    state: { type: Schema.Types.ObjectId },
    dueDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isRepeating: { type: Boolean, default: false },
    isBusy: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    tags: [ Schema.Types.ObjectId ],
    children: [ Schema.Types.ObjectId ],
  }, {
    collection: 'Tasks',
    timestamps: true
  })

  function transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  }

  schema.set('toJSON', { virtuals: true, transform: transform })
  schema.set('toObject', { virtuals: true, transform: transform })

  mongoose.model('Task', schema)

  return mongoose.model('Task')
}
