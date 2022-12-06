const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/profile.controller");

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
    "/api/profile-details",
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
};
