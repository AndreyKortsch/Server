module.exports = (sequelize, Sequelize) => {
 const User = sequelize.define("user", {
    id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    username: {
    type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
     },
     email: {
         type: Sequelize.STRING
     },
 });
 return User;
 };