const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const upload = require("../middlewares/uploadExcel");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/add-new-user", upload.single("file"), controller.addUser);
  // app.get("/api/auth/add-new-user", controller.addUser);

  app.post("/api/auth/signin", controller.signin);
};
