const { verifySignUp } = require("../middleware");


const controller = require("../controller/auth.controller");

module.exports = function(app) {
 app.use(function(req, res, next) {
 res.header(
 "Access-Control-Allow-Headers",
 "x-access-token, Origin, Content-Type, Accept, Authorization"
 );
 next();
 });
 app.post(
 "/api/auth/signup",
 [
 verifySignUp.checkDuplicateUsernameOrEmail,
 verifySignUp.checkRolesExisted
 ],
 controller.signup
 );
 app.get("/api/test/admin", controller.findAll);
 app.post("/api/auth/signin", controller.signin);
};