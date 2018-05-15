const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'hectorbliss',
    api_key: '436876978178491',
    api_secret: 'cedihymo6v7QFGFpAywqIq26kvw'
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'payments',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadCloud = multer({ storage: storage }).single('file');
module.exports = uploadCloud;