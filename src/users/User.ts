import { redisClient } from '../conf/redisConnection'
import { Document, Schema, model, Model } from 'mongoose'
import { ITask, Task } from '../tasks/Task'
const bcrypt = require('bcryptjs')
import ObjectId = Schema.Types.ObjectId

export interface IUser extends Document {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  lifeTask: ITask
  sidebarTask: ITask
  imageUrl: string
  locale: string
  googleId: string

  generateHash(password: string): string
  validPassword(password: string): boolean
}

export const UserSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  password: { type: String },
  lifeTask: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Task',
    default: new Task({
      description: 'All Tasks',
      owner: this._id,
      canComplete: false
    })
  },
  sidebarTask: {
    type: Schema.Types.ObjectId,
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
  googleId: String,
}, {
  collection: 'Users',
  timestamps: true
})

UserSchema.methods.generateHash = async (password) => {
  return await bcrypt.hash(password, bcrypt.genSalt(8), null)
}

UserSchema.methods.validPassword = async (password) => {
  return await bcrypt.compare(password, this.password)
}

function transform (doc, ret) {
  delete ret.__v // TODO: replace with more performant method
  delete ret._id // TODO: replace with more performant method
  return ret
}

UserSchema.set('toJSON', { virtuals: true, transform: transform })
UserSchema.set('toObject', { virtuals: true, transform: transform })

export const User: Model<IUser> = model<IUser>('User', UserSchema)
