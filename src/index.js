import app from './app.js'
import { config } from 'dotenv'
config()

const { PORT } = process.env

app.listen(PORT, () => {
  try {
    console.log(`Server is running on port ${PORT}`)
  } catch (err) {
    console.error(err)
  }
})
