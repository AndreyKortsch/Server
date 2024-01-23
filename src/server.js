const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./model");
var corsOptions = {
 origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
 res.json({ message: "Домашняя страница. Бэк работает"
});
});
require('./routes/auth.routes')(app);
const PORT = process.env.PORT || 8080;
db.sequelize.sync();
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}.`);
});
