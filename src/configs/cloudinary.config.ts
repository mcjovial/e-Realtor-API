import cloudinary from 'cloudinary'
require('dotenv').config()

cloudinary.v2.config({ 
  cloud_name: 'mcjovial', 
  api_key: '713374374612963', 
  api_secret: 'MnfURZPcJUZeOrA9tiKku-mVr0o' 
});

export const uploadCloudinary = (file_path: string): Promise<cloudinary.UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file_path, function(error, result) {
      if (error) reject('Upload on cloudinary failed')
      resolve(result)
    })
  })
}