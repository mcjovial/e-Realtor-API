import express from 'express'
import { createProperty, deleteProperty, filterAllproperties, getAllProperties, getProperty } from '../controllers/properties.controller'

const router = express.Router()

router.get('/api/property', getAllProperties)
router.get('/api/property/:id', getProperty)
router.post('/api/property', createProperty)
router.post('/api/property/filter', filterAllproperties)
router.delete('/api/property/:id', deleteProperty)

export { router as propertyRouter }