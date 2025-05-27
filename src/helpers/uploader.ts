import multer from "multer";
import path from "path";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config";
import fs from 'fs';

export const sendImageToCloudinary = async (file: any) => {
  // Configuration
  cloudinary.config({
    cloud_name: "dmwtqqpwz",
    api_key: "448594675449677",
    api_secret: config.cloudinary_api_secret,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.originalname,
    })
    .catch((error) => {
      console.log(error);
    });

    fs.unlinkSync(file.path)



  return uploadResult 
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
