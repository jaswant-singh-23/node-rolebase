const db = require("../models");
const Attendance = db.attendance;

exports.attendanceUpload = async (req, res) => {
  const reader = require("xlsx");
  const file = reader.readFile(req.file.destination + "/" + req.file.filename);
  let data = [];
  let message = [];
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  data = temp;
  const AttendanceData = [];
  await data.map((item, index) => {
    var rawAttendance = [];
    for (var key in item) {
      var value = item[key];
      if (key.includes("/")) {
        rawAttendance.push({ date: key, status: value });
      }
    }
    const userName = item["Employee Name"]
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    AttendanceData.push({
      name: item["Employee Name"],
      username: userName,
      designation: item["Designation"],
      department: item["Department"],
      attendance: JSON.stringify(rawAttendance),
    });
  });
  Attendance.insertMany(AttendanceData, (err, result) => {
    if (err) {
      res.status(400).send({ err: "error", message: err });
      return;
    }
    res.status(200).send({
      data: result,
      message: "Attendance uploaded successfully",
    });
  });
};

exports.attendanceAllUser = async (req, res) => {
  Attendance.find({}, (err, result) => {
    if (err) {
      res.status(400).send({ err: "error", message: err });
      return;
    }
    res.status(200).send({
      data: result,
      message: "success",
    });
  });
};

exports.attendanceofParticularUser = async (req, res) => {
  const username = req.headers["slug"];
  Attendance.findOne({ username: username }, (err, result) => {
    if (err) {
      res.status(400).send({ err: "error", message: err });
      return;
    }
    res.status(200).send({
      data: result,
      message: "success",
    });
  });
};
