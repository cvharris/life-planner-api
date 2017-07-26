import { MongoConnection } from './conf/connectMongoose'
import * as config from './package.json'
import { App } from './server'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') require('dotenv').config()

const port = process.env.PORT || 4202
const app = App
MongoConnection()

app.listen(port, () => console.log(`Listening on port ${port}`))

export default app
