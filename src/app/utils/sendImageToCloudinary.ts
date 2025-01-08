import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';

// Configuration CLOUDINARY
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

export const sendImageToCloudinary = (imageName: string, path: string) => {
    // Upload an image
    cloudinary.uploader.upload(
        path,
        {
            public_id: imageName
        },
        function (error, result) {
            console.log(result);
        }
    );
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

export const upload = multer({ storage: storage });
