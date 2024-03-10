module.exports = (sequelize, Sequelize) => {
 const Subbrand = sequelize.define("subbrand", {
    id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    name: {
    type: Sequelize.STRING
    },

 });
    return Subbrand;
 };