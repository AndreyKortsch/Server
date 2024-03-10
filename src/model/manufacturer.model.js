module.exports = (sequelize, Sequelize) => {
 const Manufacturer = sequelize.define("manufacturer", {
    id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    name: {
    type: Sequelize.STRING
    },

 });
    return Manufacturer;
 };