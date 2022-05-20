import express from 'express'
import { createUser, getAllUsers } from '../controllers/users.controller'

const router = express.Router()

router.get('/api/user', getAllUsers)
router.post('/api/user', createUser)

export { router as userRouter }