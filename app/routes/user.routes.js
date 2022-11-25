const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*','http://localhost:3001','http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
   
  });

  app.get("/api/all", controller.allAccess);

  app.get("/api//user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  // app.post(
  //   "/api/profiles",
  //   [authJwt.verifyToken],
  //   controller.profileGet
  // );
  // app.post(
  //   "/api/profile-add",
  //   [verifySignUp.checkDuplicateUsernameOrEmail],
  //   controller.profileAdd
  // );
};
