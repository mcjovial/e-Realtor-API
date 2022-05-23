import multer, { FileFilterCallback } from "multer"
import path from 'path'
import fs from 'fs'
import { uploadCloudinary } from "../configs/cloudinary.config"

interface IFileFilterCallback extends FileFilterCallback {
  (error: Error | null): void
}

const storage = multer.diskStorage({
  destination(req, file, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'src/uploads/images/')
  },
  filename(req, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, `${file.fieldname}-${Date.now()}${path}`)
  }
})

function checkFileType(file: Express.Multer.File, cb: (error: Error | null, filename: string | boolean) => void) {
  const filetypes = /jpeg|jpg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(null, 'Image format not accepted')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb:IFileFilterCallback) {
    checkFileType(file, cb)
  }
})

const uploadImagesToCloud = async (myFiles: any): Promise<string[]> => {
  // 1- store file in uploades/images through multer
  // 2- loop through each File
  // 3- ensure file path is true
  // 4- we call uploadCloudinary and pass file path to it to be uploaded on cloudinary
  // 5- we call async uploadCloudinary and pass file path and wait to be uploaded on cloudinary
  // 6- we call unlink func sync to ensure we remove the file stored on the file system
  // 7- we add the image url returned from cloudinary func and push it to the images
  // 8- return the images to the controller to resolve the route and return the images arr to client

  let myImages: any = []

  myImages = await Promise.all(
    myFiles.map(async (file: any) => {
      try {
        const fileExists = fs.statSync(file.path).isFile()
        if (fileExists) {
          const img = await uploadCloudinary(file.path)
          fs.unlink(file.path, function(err) {
            if (err) console.error(err)
            console.log('File deleted successfully')
          })
          return img?.secure_url
        }
      } catch (err) {
        console.error('File does not exist');
      }
    })
  )
  return myImages
}

export { uploadImagesToCloud }

export default upload