const { verifySignUp } = require("../middleware");
const fs = require('fs');


const controller = require("../controller/auth.controller");
const controller2 = require("../controller/image.controller");
const controller3 = require("../controller/class.controller");
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
app.post("/api/test/updatemodel", controller3.updateonemodel);
app.get("/api/test/admin", controller.findAll);
app.get("/api/test/create", controller3.createclassdata);
app.post("/api/test/class", controller3.findOne);
app.post("/api/test/manufactor", controller3.findOneManufactor);
app.post("/api/test/subbrand", controller3.findOneSubbrand);
app.post("/api/auth/signin", controller.signin);
app.post("/api/auth/image", controller2.sendimage);
app.get('/api/model', (req, res) => {
        fs.readFile('./modeljs/model.json', 'utf8', (err, data) => {
            if (err) {
                console.error('ќшибка чтени€ файла:', err);
                res.status(500).send('¬нутренн€€ ошибка сервера');
                return;
            }
            const jsonData = JSON.parse(data);

            // ќтправка содержимого JSON файла как ответ на запрос
            res.json(jsonData);
        });
    });
};