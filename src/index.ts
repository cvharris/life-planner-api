import { MongoConnection } from './conf/connectMongoose'
import * as config from './package.json'
import { App } from './server'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') require('dotenv').config()

const port = process.env.PORT || 4202
const app = App
MongoConnection()

app.use(async (ctx, next) => {
  this.set('Access-Control-Allow-Origin', '*')
  this.set('Access-Control-Allow-Headers', ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type', 'If-None-Match', 'enctype'])
  this.set('Access-Control-Expose-Headers', ['Accept', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type'])
  this.set('Access-Control-Allow-Credentials', true)
  await next()
})

app.use(async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next()
  } else {
    ctx.redirect('/401')
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`))

export default app
