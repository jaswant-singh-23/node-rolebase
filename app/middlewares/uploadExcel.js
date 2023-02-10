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
    cb(null, path.join(`${__dirname}/../public/excel/users`));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-ameo-hrm-${file.originalname}`);
  },
});

var upload = multer({ storage: storages, fileFilter: excelFilter });
module.exports = upload;



var datetime = new Date();
var date = datetime.toISOString().slice(0,10);

var storageAttendance = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(`${__dirname}/../public/excel/attendance`));
  },
  filename: (req, file, cb) => {
    cb(null, `${date}-${file.originalname}`);
  },
});

var uploadAttendance = multer({ storage: storageAttendance, fileFilter: excelFilter });
module.exports = uploadAttendance;