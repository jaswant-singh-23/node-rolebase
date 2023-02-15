const { authJwt } = require("../middlewares");
const controller = require("../controllers/vacancy.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
  app.get(
    "/api/vacancy-details",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.vacancyDetails
  );
  app.post(
    "/api/new-vacancy-hiring",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.addnewVacancy
  );
  app.post(
    "/api/vacancy-delete",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.vacancyDelete
  );
};
