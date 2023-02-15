const { authJwt } = require("../middlewares");
const controller = require("../controllers/attendance.controller");
const uploadAttendance = require("../middlewares/uploadExcel");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.post(
    "/api/attendance-upload",
    [authJwt.verifyToken, authJwt.isModerator],
    uploadAttendance.single("file"),
    controller.attendanceUpload
  );
  app.get(
    "/api/attendance-of-all-user",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.attendanceAllUser
  );
  app.get(
    "/api/attendance-of-particular-user",
    [authJwt.verifyToken],
    controller.attendanceofParticularUser
  );
};
