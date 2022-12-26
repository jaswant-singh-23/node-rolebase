const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/profile.controller");
const upload = require("../middlewares/upload");
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
    "/api/all-profile-details",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.profileDetails
  );
  app.get(
    "/api/profile-Add",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.profileAdd
  );

  app.get(
    "/api/departments",
    // [authJwt.verifyToken],
    controller.departmentDetails
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
  app.post(
    "/api/delete-employee-account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteEmployeeAccount
  );
  app.post(
    "/api/upload-user-avatar",
    [authJwt.verifyToken, upload.single('image')],
    controller.avatarUpload
  );
  app.get(
    "/api/inventory-view",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.inventoryView
  );
  app.post(
    "/api/inventory-add",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.inventoryAdd
  );
  app.post(
    "/api/inventory-edit",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.inventoryAdd
  );
  app.get(
    "/api/alumni-view",
    // [authJwt.verifyToken, authJwt.isModerator],
    controller.alumnidetails
  );
};
