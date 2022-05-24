import express from 'express'
import { createUser, deleteUser, getAllUsers, loginUser, logoutUser } from '../controllers/users.controller'
import { verifyAdmin, verifyTokenStored, verifyUserToken } from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/api/user', verifyUserToken, verifyTokenStored, verifyAdmin, getAllUsers)
router.post('/api/user', createUser)
router.post('/api/user/login', loginUser)
router.post('/api/user/logout', verifyUserToken, verifyTokenStored, logoutUser)
router.delete('/api/user/delete/:id', verifyUserToken, verifyTokenStored, deleteUser)

export { router as userRouter }