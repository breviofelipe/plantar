import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: 'dosghtja7',
  api_key: process.env.CLOUDINARY_API_KEY || '<your_api_key>',
  api_secret: process.env.CLOUDINARY_API_SECRET || '<your_api_secret>',
});

export const uploadImage = async (imagePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'plant_photos',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};