import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env('CLOUDINARY_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_SECRET'),
});

export const saveToCloudinary = async (file) => {
  const res = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);

  return res.secure_url;
};
