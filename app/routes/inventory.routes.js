const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/inventory.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.post(
    "/api/inventory-view-by-id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.inventoryGetById
  );
  app.get(
    "/api/inventory-view",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.inventoryView
  );
  app.post(
    "/api/inventory-add",
    [
      authJwt.verifyToken,
      verifySignUp.checkUsernameOrEmailExist,
      authJwt.isModerator,
    ],
    controller.inventoryAdd
  );
  app.post(
    "/api/inventory-edit",
    [
      authJwt.verifyToken,
      verifySignUp.checkUsernameOrEmailExist,
      authJwt.isModerator,
    ],
    controller.inventoryEdit
  );
  app.post(
    "/api/inventory-delete",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.inventoryDelete
  );
};
