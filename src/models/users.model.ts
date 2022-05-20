import mongoose from 'mongoose'
import { LoginCredentials, UserAttributes } from '../constants/types'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema

interface UserCreationAttributes extends mongoose.Model<UserDoc> {
  build(attr: UserAttributes): UserDoc
}

interface UserDoc extends mongoose.Document {
  _id: string
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


// @desc    Get user using their email & password
// @type    Class methods
export async function findByCredentials(email: string, password: string): Promise<UserAttributes | null> {
  const user = await User.findOne({ email })

  if (!user || !(user instanceof User)) {
    throw new Error('Unable to login, Wrong Email or Password!')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Invalid Password')
  }

  return user
}

// @desc    Generate JWT authentication Token
// @type    Instance Methods
export async function generateJwtAuthToken(user: UserAttributes): Promise<string> {
  if (!user._id) throw new Error('Invalid user id')

  const token = jwt.sign({ id: user._id.toString() }, 'verysecretjwttokenmsg', { expiresIn: '4d' })

  if(!token) throw new Error('Token Creation Failed')

  return token
}

export { User }