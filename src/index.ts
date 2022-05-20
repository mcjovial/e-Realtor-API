import express from 'express';
import mongoose from 'mongoose'
import { json } from 'body-parser';
import { todoRouter } from './routes/todo'
import { userRouter } from './routes/users.router';

require('dotenv').config()

const app = express()
const uri = process.env.MONGO_DB_URI || 'mongodb+srv://mcjovial:19971104Mj@cluster0.ia2nm.mongodb.net/?retryWrites=true&w=majority'
const port = process.env.PORT || 3000

app.use(json())
app.use(todoRouter)
app.use(userRouter)

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