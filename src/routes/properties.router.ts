import express from 'express'
import { createProperty, deleteProperty, filterAllproperties, getAllProperties, getProperty } from '../controllers/properties.controller'
import { verifyTokenStored, verifyUserToken } from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/api/property', getAllProperties)
router.get('/api/property/:id', getProperty)
router.post('/api/property', verifyUserToken, verifyTokenStored, createProperty)
router.post('/api/property/filter', filterAllproperties)
router.delete('/api/property/:id', verifyUserToken, verifyTokenStored, deleteProperty)

export { router as propertyRouter }