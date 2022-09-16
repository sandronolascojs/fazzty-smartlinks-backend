import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

// import database
import './config/database.js'

// import routes from 'routes'
import tracksRouter from './routes/tracks.routes.js'
import linksRouter from './routes/links.routes.js'
import usersRouter from './routes/users.routes.js'
import authRouter from './routes/auth.routes.js'
import publicLinksRouter from './routes/publicLinks.routes.js'
import searchLinksRouter from './routes/search.routes.js'

// import middlewares
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()
// middlewares
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// use routes
app.use('/api/v1/tracks', tracksRouter)
app.use('/api/v1/links', linksRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/public', publicLinksRouter)
app.use('/api/v1/search', searchLinksRouter)

// request handlers
app.use(errorHandler)

export default app
