const db = require("../models");
const User = db.user;
const Attendance = db.attendance;
const moment = require("moment");

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
    const slug = item["Employee Name"]
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/[^\w-]+/, " ");
    if (rawAttendance != null && rawAttendance.length > 0) {
      AttendanceData.push({
        name: item["Employee Name"],
        slug: slug,
        designation: item["Designation"],
        department: item["Department"],
        attendance: JSON.stringify(rawAttendance),
      });
    }
  });
  if (AttendanceData != null && AttendanceData.length > 0) {
    console.log("AttendanceData", AttendanceData);
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
  }
};
exports.attendanceAllUser = async (req, res) => {
  Attendance.find({ status: true }, (err, result) => {
    if (err) {
      res.status(400).send({ err: "error", message: err });
      return;
    }

    const data = [];
    result.forEach(async (item, index) => {
      await data.push({
        name: item.name,
        designation: item.designation,
        department: item.designation,
        attendance: JSON.parse(item.attendance),
      });
    });
    res.status(200).send({
      // attendanceData:
      data: data,
      message: "success",
    });
  });
};

exports.attendanceofParticularUser = async (req, res) => {
  const slug = req.headers["name"]
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/[^\w-]+/, " ");
  Attendance.findOne({ slug: slug }, (err, result) => {
    if (err) {
      res.status(400).send({ err: err, message: "failed" });
      return;
    }
    const data = {
      attendance: JSON.parse(result.attendance),
      name: result.name,
      designation: result.designation,
      department: result.department,
    };
    data.attendance.forEach(async (item, index) => {
      data.attendance[index].date = moment(item.date).format("YYYY-MM-DD");
      const status = item.status.toUpperCase();
      data.attendance[index].status =
        status == "P" ? "Present" : status == "A" ? "Absent" : "Leave";
      // console.log("/////", moment(item.date).format("YYYY-MM-DD"), "/////");
    });
    console.log(data, "data");
    res.status(200).send({
      data: data,
      message: "success",
    });
  });
};
