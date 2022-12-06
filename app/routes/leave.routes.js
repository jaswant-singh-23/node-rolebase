const { authJwt } = require("../middlewares");
const controller = require("../controllers/leave.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.get(
    "/api/leave-details",
    // [authJwt.verifyToken, authJwt.isModerator],
    controller.leaveDetails
  );
  app.post("/api/leave-apply", [authJwt.verifyToken], controller.leaveApply);

  app.post("/api/leave-reply", [authJwt.verifyToken], controller.leaveReply);

};
