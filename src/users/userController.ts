import { Context } from 'koa'
import { User } from './User'
import { Task } from '../tasks/Task'

export class UserController {

  async list(ctx: Context, next) {
    const result = await User.findOne()

    ctx.body = result
  }

  async create (ctx, next) {
    const user = new User({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.payload.lastName,
      email: ctx.request.payload.email
    })

    const lifeTask = new Task({
      _id: user.lifeTask,
      description: 'All Tasks',
      owner: user._id,
      canComplete: false
    })
    user.lifeTask = await lifeTask.save()

    const sideTask = new Task({
      _id: user.sidebarTask,
      description: 'Sidebar',
      owner: user._id,
      canComplete: false
    })
    user.sidebarTask = await sideTask

    const result = await user.save()

    ctx.body = result
  }

  async update(ctx, next) {
    const user = await User.findByIdAndUpdate(ctx.request.params.userId, ctx.request.payload, { new: true })

    ctx.body = user
  }

  async deleteUser (ctx, next) {
   ctx.body = `application "${ctx.request.params.userId}" deleted!`
  }

  async getOneByAuthToken(ctx, next) {
    const user = await User.findById(ctx.state.user.id)
      .populate({ path: 'lifeTask', populate: { path: 'children' }})
      .populate({ path: 'sidebarTask', populate: { path: 'children' }})

    ctx.body = user
  }

  async getOneById (ctx, next) {
    const user = await User.findById(ctx.request.params.userId)
      .populate('lifeTask sidebarTask')

    ctx.body = user
  }
}

export const userCtrl = new UserController()
