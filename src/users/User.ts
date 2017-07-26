import { Document, Schema, model, Model } from 'mongoose'
import { ITask, Task } from '../tasks/Task'
import ObjectId = Schema.Types.ObjectId

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  lifeTask: ITask
  sidebarTask: ITask
  imageUrl: string
  locale: string
  googleId: string
}

export const UserSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
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

UserSchema.set('toJSON', { virtuals: true, transform: transform })
UserSchema.set('toObject', { virtuals: true, transform: transform })

export const User: Model<IUser> = model<IUser>('User', UserSchema)
