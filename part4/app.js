const express= require('express')
const {MONGODB_URI} = require('./utils/config')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()

const url = MONGODB_URI

mongoose.connect(url)
  .then(()=> logger.info('connected to mongodb'))
  .catch((err) => logger.error('connection failed:\n', err))

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.get('/', (req,res)=>{
  res.status(200).send("Hello, enjoy the blogs")
})
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app