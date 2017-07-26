import { TaskController, taskCtrl } from './taskController'
import * as Router from 'koa-router'

export class TaskRouter {
  ctrl: TaskController
  router: Router

  constructor() {
    this.ctrl = taskCtrl
    this.router = new Router()
    this.router.get('/task', this.ctrl.listTasks)
    this.router.get('/task/:taskId', this.ctrl.getTask)
    this.router.patch('/task/:taskId', this.ctrl.patchTask)
    this.router.post('/task', this.ctrl.createTask)
    this.router.post('/task/:taskId/child', this.ctrl.createChildTask)
  }
}

export const TaskRoutes = new TaskRouter().router
