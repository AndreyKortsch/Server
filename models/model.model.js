module.exports = (sequelize, Sequelize) => {
 const Model = sequelize.define("model", {
 id: {
 type: Sequelize.INTEGER,
        primaryKey: true,
       autoIncrement:true
 },
 name: {
 type: Sequelize.STRING
 }
 });
 return Model;
 };