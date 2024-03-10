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
db.class = require("./class.model.js")(sequelize, Sequelize);
db.manufacturer = require("./manufacturer.model.js")(sequelize, Sequelize);
db.model = require("./model.model.js")(sequelize, Sequelize);
db.subbrand = require("./subbrand.model.js")(sequelize, Sequelize);

db.class.hasMany(db.image, {
 //   foreignKey: "imageId",
});
db.image.belongsTo(db.class, {
    foreignKey: "classId",
});
db.class.hasMany(db.manufacturer, {
 //foreignKey: "manufacturerId",
});
db.manufacturer.belongsTo(db.class, {
foreignKey: "classId",
});
db.manufacturer.hasMany(db.subbrand, {
 // foreignKey: "subbrandId",
});
db.subbrand.belongsTo(db.manufacturer, {
foreignKey: "manufacturerId",
});
db.subbrand.hasMany(db.model, {
  // foreignKey: "modelId",
});
db.model.belongsTo(db.subbrand, {
foreignKey: "subbrandId",
});
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
db.user.hasMany(db.image, {
   // foreignKey: "imageId",

});
db.image.belongsTo(db.user, {
    foreignKey: "userId",
});
db.ROLES = ["user", "admin", "other", "den", "iden", "iden2", "iden3", "out", "in"];
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Миграции применены');
})
module.exports = db;