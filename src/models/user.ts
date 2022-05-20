import mongoose from 'mongoose'
import { UserAttributes } from '../constants/types'

const Schema = mongoose.Schema

interface UserCreationAttributes extends mongoose.Model<UserDoc> {
  build(attr: UserAttributes): UserDoc
}

interface UserDoc extends mongoose.Document {
  name: string
  email: string
  password: string
  phone: string
  isAdmin: boolean
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: Number,
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model<UserDoc, UserCreationAttributes>('User', userSchema)

userSchema.statics.build = (attr: UserAttributes) => {
  return new User(attr)
}

// User.build({
//   name: 'string',
//   email: 'string',
//   password: 'string',
//   phone: 'string',
//   isAdmin: false
// })

export { User }