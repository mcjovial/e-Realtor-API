import express from 'express'
import mongoose from 'mongoose'
import { json } from 'body-parser'
import { todoRouter } from './routes/todo'
import { userRouter } from './routes/users.router'
import { propertyRouter } from './routes/properties.router'
import { uploadRouter } from './routes/uploads.router'
import { notFoundRoute } from './middlewares/errors.middleware'
import './db'

require('dotenv').config()

const app = express()
const uri = process.env.MONGO_DB_URI || 'mongodb+srv://mcjovial:19971104Mj@cluster0.ia2nm.mongodb.net/?retryWrites=true&w=majority'
const port = process.env.PORT || 3000

app.use(json())

app.use(express.static(__dirname + '/uploads'))

app.use(todoRouter)
app.use(userRouter)
app.use(uploadRouter)
app.use(propertyRouter)
app.use(notFoundRoute)

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, () => {
  console.log('MongoDb Connected')
})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})