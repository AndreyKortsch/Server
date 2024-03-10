module.exports = (sequelize, Sequelize) => {
 const Model = sequelize.define("model", {
 id: {
 type: Sequelize.INTEGER,
        primaryKey: true,
       autoIncrement:true
 },
 name: {
 type: Sequelize.STRING
 },
 count: {
     type: Sequelize.INTEGER
 },
 price: {
     type: Sequelize.FLOAT
 }
 });
 return Model;
 };