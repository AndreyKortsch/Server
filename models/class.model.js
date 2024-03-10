module.exports = (sequelize, Sequelize) => {
 const Class = sequelize.define("class", {
 id: {
 type: Sequelize.INTEGER,
        primaryKey: true,
       autoIncrement:true
 },
 name: {
 type: Sequelize.STRING
 }
 });
 return Class;
 };