import mongoose = require('mongoose')

export const MongoConnection = () => {
  const databaseName = 'lifePlanner'
  mongoose.Promise = global.Promise

  console.log('Connecting to MongoDb.', {
    databaseName
  })

  const options = {
    promiseLibrary: global.Promise
  }
  mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`, options)
}
