import express from 'express'
import { createUser, deleteUser, getAllUsers, loginUser, logoutUser } from '../controllers/users.controller'

const router = express.Router()

router.get('/api/user', getAllUsers)
router.post('/api/user', createUser)
router.delete('/api/user/delete/:id', deleteUser)
router.post('/api/user/login', loginUser)
router.post('/api/user/logout', logoutUser)

export { router as userRouter }