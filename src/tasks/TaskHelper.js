'use strict'

module.exports = function() {
  return {
    transform: transform,
  }

  function canSetCompletedByChildren(val) {
    return this.canComplete ? val : false
  }

  function transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  }
}