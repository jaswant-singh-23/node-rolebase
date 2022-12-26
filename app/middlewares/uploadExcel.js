const multer = require('multer');
const path = require("path");

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

var storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(`${__dirname}/../public/excel`));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-ameo-hrm-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storages, fileFilter: excelFilter });
module.exports = uploadFile;