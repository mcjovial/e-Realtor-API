import { Request, Response } from 'express'
import { UserAttributes } from '../constants/types'
import { User } from '../models/user'
import bcrypt from 'bcryptjs'

// 400 Bad Request -> The 400 status code, or Bad Request error, means the HTTP request that was sent to the server has invalid syntax.
// 401 unauthneticated
// 403 unauthorized

// @desc    fetch all users
// @route   GET /users
// @access  Private/Admin
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})

    if (!users) throw new Error('Could not retrieve all users')

    res.status(200).send({ users })
  } catch (err) {
    let errorMessage = 'Wrong credentials'

    if (err instanceof Error){
      errorMessage = err.message
    }

    res.status(403).send({ error: err.message })
  }
}

// @desc    Create/Auth User & Get token
// @route   POST /users/register
// @access  Public
const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: UserAttributes = req.body

    const existingUser = await User.findOne({ email: newUser.email })

    if (existingUser) {
      throw new Error('User already exists, Try a different Email Address')
    }

    const user = await new User(newUser)
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err
        user.password = hash
        user.save()
      })
    })

    if (!user || !(user instanceof User)) throw new Error('User creation failed!')

    res.status(201).send({
      message: 'User Created Successfully!',
      name: user.name,
      email: user.email,
      phone: user.phone
    })
  } catch (err) {
    let errorMessage = 'User not Created, Operation Failed!'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(400).send({ error: err.message })
  }
}

export { getAllUsers, createUser }