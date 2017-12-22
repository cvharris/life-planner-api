import { Context } from 'koa'
import { Types } from 'mongoose'
import { ITask, Task } from '../tasks/Task'
import { User } from '../users/User'
import * as _ from 'lodash'
import ObjectId = Types.ObjectId

export class TaskController {

  async getTask (ctx: Context, next) {
    let task

    try {
      task = await Task.findById(ctx.params.taskId)
        .populate('children')
    } catch (e) {
      ctx.throw(404)
    }

    ctx.body = task
  }

  async createChildTask (ctx: Context, next) {
    let task = new Task(ctx.request.body)

    try {
      task = await task.save()
      const parent = await Task.findById(ctx.params.taskId)
      parent.children.push(task)
      await parent.save()
    } catch (e) {
      ctx.throw(404)
    }

    ctx.body = task
  }

  async getSidebarTasks (ctx: Context, next) {
    const user = await User.findById(ctx.state.user.id)
    let result = await Task.find({
      isActive: true,
      isCompleted: false,
      _id: { $ne: user.lifeTask },
      children: { $not: { $size: 0 } }
    }).populate('children')

    result = result.filter(task => task.children.some(child => !child.isCompleted) || !task.isCompletedByChildren)

    ctx.body = result
  }

  async listTasks (ctx: Context, next) {
    const criteria = {
      isActive: true,
      owner: new Types.ObjectId(ctx.state.user.id)
    }
    _.merge(criteria, ctx.query)

    const result = await Task.find(criteria)

    ctx.body = result
  }

  async createTask (ctx: Context, next) {
    const task = new Task(ctx.request.body)

    let result
    try {
      result = await task.save()
      const parent = await Task.findById(ctx.state.user.lifeTask)
      parent.children.push(task)
      await parent.save()
    } catch (e) {
      ctx.throw(400, e)
    }

    ctx.body = result
  }

  async patchTask (ctx: Context, next) {
    const task = await Task.findById(ctx.params.taskId)
    _.extend(task, ctx.request.body)

    const result = await task.save()

    ctx.body = result
  }

  async deactivateTask (ctx: Context, next) {
    const taskId = ctx.params.taskId
    const task = await Task.findByIdAndUpdate(taskId, { isActive: false }, { new: true })

    let parent = await Task.findById(ctx.request.body.parentId).populate('children')
    parent.children = parent.children.filter(child => child.id !== taskId)
    parent = await parent.save()

    ctx.body = task
  }

  async deleteTask (ctx: Context, next) {
    // TODO: deprecated. Make Service method only
    await Task.findByIdAndRemove(ctx.params.taskId)

    ctx.body = `Task ${ctx.params.taskId} deleted!`
    ctx.status = 204
  }
}

export const taskCtrl = new TaskController()
