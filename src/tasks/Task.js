'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

module.exports = function (TaskHelper) {

  const schema = new Schema({
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: [ ObjectId ],
    state: { type: ObjectId },
    dueDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    canComplete: { type: Boolean, },
    isCompletedByChildren: { type: Boolean, },
    isActive: { type: Boolean, default: true },
    isRepeating: { type: Boolean, default: false },
    isBusy: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    tags: [{ type: ObjectId, ref: 'Tag' }],
    children: [{ type: ObjectId, ref: 'Task' }],
  }, {
    collection: 'Tasks',
    timestamps: true
  })

  schema.set('toJSON', { virtuals: true, transform: TaskHelper.transform })
  schema.set('toObject', { virtuals: true, transform: TaskHelper.transform })

  mongoose.model('Task', schema)

  return mongoose.model('Task')
}
