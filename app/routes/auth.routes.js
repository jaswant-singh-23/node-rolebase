const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();

  });

  /*app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin); */

  app.post("/api/auth/signup", controller.signup);

  app.post("/api/auth/signin", controller.signin);
 
  app.get("/api/auth/get-metrics", controller.getMetrics);

  app.post("/api/auth/add-metrics", controller.addMetrics);

  app.post("/api/auth/update-metrics", controller.updateMetrics);

  app.post("/api/auth/delete-metrics", controller.deleteMetrics);

  app.get("/api/auth/get-bands", controller.getBands);

  app.post("/api/auth/add-bands", controller.addBands);

  app.post("/api/auth/update-bands", controller.updateBands);

  app.post("/api/auth/update-status-bands", controller.updateStatusBands);

  app.post("/api/auth/delete-bands", controller.deleteBands);

  app.get("/api/auth/get-quiz", controller.getQuiz);

  app.post("/api/auth/get-quiz-by-id", controller.getQuizById);

  app.post("/api/auth/add-quiz", controller.addQuiz);

  app.post("/api/auth/update-quiz", controller.updateQuiz);

  app.post("/api/auth/delete-quiz", controller.deleteQuiz);

  app.get("/api/auth/get-customer-view", controller.getCustomerView);

  app.get("/api/auth/get-agent-metrics", controller.getAgentMatrics);
};
