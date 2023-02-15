const { authJwt } = require("../middlewares");
const controller = require("../controllers/alumani.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.post(
    "/api/delete-employee-account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.addToAlumni
  );
  app.get(
    "/api/alumni-view",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.alumnidetails
  );
  app.post(
    "/api/alumni-delete-employee-account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteEmployeeAccount
  );
  app.post(
    "/api/alumni-restore-employee-account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.restoreEmployeeAccount
  );
};
