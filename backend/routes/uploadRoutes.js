import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import { protect } from '../middleware/authMiddleware.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogweb-media',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// @desc    Upload media
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.send({
    message: 'File uploaded successfully',
    url: req.file.path,
  });
});

router.use((err, req, res, next) => {
  console.error("Upload Error:", err);
  res.status(500).json({ message: err.message || 'Server upload error' });
});

export default router;
