import express from 'express'
import { uploadImages } from '../controllers/uploads.controller'
import upload from '../multer/multer'


const router = express.Router()

router.post('/', upload.array('avatar', 3), uploadImages)

export { router as uploadRouter}

