const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/profile.controller");
const upload = require("../middlewares/upload");
const uploadAttendance = require("../middlewares/uploadExcel");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.get(
    "/api/get-a-profile",
    [authJwt.verifyToken],
    controller.ProfileGetById
  );

  app.get(
    "/api/upcoming-birthday",
    [authJwt.verifyToken],
    controller.getUpcomingBirthday
  );
  
  app.get(
    "/api/all-profile-details",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.profileDetails
  );
  app.get(
    "/api/general-department",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.departmentAndEmployeeCount
  );
  app.get(
    "/api/profile-Add",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.profileAdd
  );

  app.post(
    "/api/user-password-update",
    [authJwt.verifyToken],
    controller.updateUserPassword
  );

  app.get(
    "/api/departments",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.departmentDetails
  );

  app.get(
    "/api/department-names",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.departmentNames
  );

  app.post(
    "/api/get-particular-department",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getPariculardepartment
  );

  app.post(
    "/api/get-particular-profile",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.GetParticularProfile
  );
  app.post(
    "/api/update-employee-details",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.updateEmployeeDetails
  );
  /*app.post(
    "/api/delete-employee-account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteEmployeeAccount
  );*/

  app.post(
    "/api/upload-user-avatar",
    [authJwt.verifyToken, upload.single("image")],
    controller.avatarUpload
  );
};
