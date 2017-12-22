import { IUser } from '../users/User'
import { Document, Schema, model, Model } from 'mongoose'
import ObjectId = Schema.Types.ObjectId

export interface ITask extends Document {
  description: string
  owner: IUser
  id: string
  assignedTo: IUser[]
  state: ObjectId
  startDate: Date
  endDate: Date
  canComplete: boolean
  isActive: boolean
  isRepeating: boolean
  isBusy: boolean
  isCompleted: boolean
  isCompletedByChildren: boolean
  tags: ITask[]
  children: ITask[]
}

export const TaskSchema: Schema = new Schema({
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
  // state: { type: ObjectId },
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

TaskSchema.set('toJSON', { virtuals: true, transform: this.transform })
TaskSchema.set('toObject', { virtuals: true, transform: this.transform })

function transform (doc: Document, ret: Document) {
  delete ret._id
  delete ret.__v
  return ret
}

export const Task: Model<ITask> = model<ITask>('Task', TaskSchema)
