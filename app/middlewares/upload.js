// const util = require("util");
// const path = require("path");
// const multer = require("multer");

// var storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, path.join(`${__dirname}/../public/assets/images`));
//   },
//   filename: (req, file, callback) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       var message = `<strong>${file.originalname}</strong> is invalid. Only accept png/jpeg.`;
//       return callback(message, null);
//     }
//     var filename = `${Date.now()}-jn-${file.originalname}`;
//     callback(null, filename);
//   }
// });

// var uploadFiles = multer({ storage: storage }).array("image-files", 10);
// var uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;



const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Cloudinary = require("../config/upload.config");

cloudinary.config({
  cloud_name: Cloudinary.CLOUD_NAME,
  api_key: Cloudinary.API_KEY,
  api_secret: Cloudinary.API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "HRM",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

const upload = multer({ storage: storage });
module.exports = upload;
