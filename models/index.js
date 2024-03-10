'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.class = require("./class.model.js")(sequelize, Sequelize);
db.manufacturer = require("./manufacturer.model.js")(sequelize, Sequelize);
db.model = require("./model.model.js")(sequelize, Sequelize);
db.subbrand = require("./subbrand.model.js")(sequelize, Sequelize);

db.class.hasMany(db.image, {
    through: "subbrand_model",
    foreignKey: "modelId",
    otherKey: "subbrandId"
});
db.model.belongsTo(db.subbrand, {
    through: "subbrand_model",
    foreignKey: "subbrandId",
    otherKey: "modelId"

db.class.hasMany(db.manufacturer, {
    through: "class_manufacturer",
    foreignKey: "manufacturerId",
    otherKey: "classId"
});
db.manufacturer.belongsTo(db.class, {
    through: "class_manufacturer",
    foreignKey: "classId",
    otherKey: "manufacturerId"
});
db.manufacturer.hasMany(db.subbrand, {
    through: "manufacturer_subbrand",
    foreignKey: "subbrandId",
    otherKey: "manufacturerId"
});
db.subbrand.belongsTo(db.manufacturer, {
    through: "manufacturer_subbrand",
    foreignKey: "manufacturerId",
    otherKey: "subbrandId"
});
db.subbrand.hasMany(db.model, {
    through: "subbrand_model",
    foreignKey: "modelId",
    otherKey: "subbrandId"
});
db.model.belongsTo(db.subbrand, {
    through: "subbrand_model",
    foreignKey: "subbrandId",
    otherKey: "modelId"
});
db.sequelize.sync({ force: true }).then(() => {
    console.log('Миграции применены');
});
module.exports = db;
