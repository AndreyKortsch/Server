const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 config.DB,
 config.USER,
 config.PASSWORD,
 {
 host: config.HOST,
 dialect: config.dialect,
 operatorsAliases: false,
 pool: {
 max: config.pool.max,
 min: config.pool.min,
 acquire: config.pool.acquire,
 idle: config.pool.idle
 }
 }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.image = require("./image.model.js")(sequelize, Sequelize);
db.role.belongsToMany(db.user, {
 through: "user_roles",
 foreignKey: "roleId",
 otherKey: "userId"
});
db.user.belongsToMany(db.role, {
 through: "user_roles",
 foreignKey: "userId",
 otherKey: "roleId"
});
db.user.belongsToMany(db.image, {
    through: "user_image",
    foreignKey: "userId",
    otherKey: "imageId"
});
db.image.belongsToMany(db.user, {
    through: "user_image",
    foreignKey: "imageId",
    otherKey: "userId"
});
db.ROLES = ["user", "admin", "other", "den", "iden", "iden2", "iden3","out", "in"];
module.exports = db;