import mongoose from 'mongoose'
import { DATABASE_URL } from './envProcess.js'

const db = mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((result) => {
    console.log(`Connected to DB : ${result.connection.name}`)
  }).catch((err) => { console.log(err) })

export default db
