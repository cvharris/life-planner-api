import { Context } from 'koa'
import { User } from './User'

export class UserController {

  async list(ctx: Context, next) {
    const result = await User.find()

    ctx.body = result
  }

  async create (ctx, next) {
    const user = new User({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.payload.lastName,
      email: ctx.request.payload.email
    })

    const result = user.save()

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
      .populate('lifeTask sidebarTask')

    ctx.body = user
  }

  async getOneById (ctx, next) {
    const user = await User.findById(ctx.request.params.userId)
      .populate('lifeTask sidebarTask')

    ctx.body = user
  }
}

export const userCtrl = new UserController()
