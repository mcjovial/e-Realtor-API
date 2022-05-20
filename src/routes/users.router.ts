import express from 'express'
import { createUser, deleteUser, getAllUsers } from '../controllers/users.controller'

const router = express.Router()

router.get('/api/user', getAllUsers)
router.post('/api/user', createUser)
router.delete('/api/user/delete/:id', deleteUser)

export { router as userRouter }