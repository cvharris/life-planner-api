import { TaskController, taskCtrl } from './taskController'
import * as Router from 'koa-router'
import * as passport from 'koa-passport'

export class TaskRouter {
  ctrl: TaskController
  router: Router

  constructor() {
    this.ctrl = taskCtrl
    this.router = new Router()
    this.router.get('/task', passport.authenticate('jwt'), this.ctrl.listTasks)
    this.router.get('/task/:taskId', passport.authenticate('jwt'), this.ctrl.getTask)
    this.router.post('/task', passport.authenticate('jwt'), this.ctrl.createTask)
    this.router.patch('/task/:taskId', passport.authenticate('jwt'), this.ctrl.patchTask)
    this.router.put('/task/:taskId', passport.authenticate('jwt'), this.ctrl.deactivateTask)
    this.router.post('/task/:taskId/child', passport.authenticate('jwt'), this.ctrl.createChildTask)
  }
}

export const TaskRoutes = new TaskRouter().router
