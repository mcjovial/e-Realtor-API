import { Request, Response } from 'express'
import { UserAttributes } from '../constants/types'
import { findByCredentials, generateJwtAuthToken, User } from '../models/users.model'
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

    const token = await generateJwtAuthToken(user)

    if (!token) throw new Error('Generating Token Failed')


    res.status(201).send({
      message: 'User Created Successfully!',
      name: user.name,
      email: user.email,
      phone: user.phone,
      token
    })
  } catch (err) {
    let errorMessage = 'User not Created, Operation Failed!'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(400).send({ error: err.message })
  }
}

// @desc    delete user by id
// @route   DELETE /users/delete/:id
// @access  Private/Admin
const deleteUser = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id

    await User.deleteOne({ _id: id })

    // TODO: delete property assosiated with user also 

    res.status(200).send({ message: 'User deleted with Associated Properties' })
  } catch (err) {
    let errorMessage = 'Deleting User Failed'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(403).send({ error: err.message })
  }
}

// @desc    Auth user & Get token
// @route   POST users/login
// @access  Public
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password} = req.body

    const user = await findByCredentials(email, password)

    if (!user) throw new Error('Authentication Failed')

    const token = await generateJwtAuthToken(user)

    if (!token) throw new Error('Generating Token Failed')

    res.status(200).send({
      name: user.name,
      email: user.email,
      phone: user.phone,
      token
    })
  } catch (err) {
    let errorMessage = 'Wrong Credentials'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(401).send({ error: err.message })
  }
}

// @desc    logout user & Blacklist token
// @route   POST /users/logout
// @access  Private
const logoutUser = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user
    const token = res.locals.token

    if (!user || !token) throw new Error('User or Token is invalid')

    // TODO: Redis procedure

    // // remove the refresh token
    // await delRedisValue(user.id.toString())

    // // blacklist current access token
    // await setRedisValue('BL_' + user.id.toString(), { token })

    res.status(200).send({ message: 'User Logged out' })
  } catch (err) {
    let errorMessage = 'Logout Failed'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(403).send({ error: err.message })
  }
}

export { getAllUsers, createUser, deleteUser, loginUser, logoutUser }