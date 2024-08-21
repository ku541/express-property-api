import { mkdir, unlink } from 'node:fs/promises';

import multer from 'multer';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

const ALLOWED_MIME_TYPES = ['image/webp', 'image/jpeg', 'image/png'];
const ALLOWED_FILE_SIZE_IN_MB = 5;

const upload = multer({
    dest: process.env.MULTER_UPLOAD_PATH,
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(new Error('Only a jpeg or a png is allowed.'));
        }

        cb(null, true);
    },
    limits: { fileSize: ALLOWED_FILE_SIZE_IN_MB * 1024 * 1024 }
});

const optimize = async (req, width) => {
    await mkdir(process.env.SHARP_UPLOAD_PATH, { recursive: true });

    const optimizedImagePath = `${process.env.SHARP_UPLOAD_PATH}/${req.file.filename}`;

    await sharp(req.file.path)
        .resize(width)
        .webp()
        .toFile(optimizedImagePath);

    return optimizedImagePath;
}

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
}

const uploadAndCleanUp = async (path, folder, req) => {
    const uploaded = await cloudinary.uploader
        .upload(path, { asset_folder: folder });

    await unlink(`${process.env.MULTER_UPLOAD_PATH}/${req.file.filename}`);

    await unlink(path);

    return uploaded.secure_url;
}

const destroy = async (url) => {
    const publicId = url.split('/').pop().split('.').shift();

    await cloudinary.uploader.destroy(publicId);
}

export {
    upload,
    optimize,
    configureCloudinary,
    uploadAndCleanUp,
    destroy
};