module.exports = (sequelize, Sequelize) => {
const Image = sequelize.define("image", {
id: {
type: Sequelize.INTEGER,
primaryKey: true,
autoIncrement: true
},
name: {
type: Sequelize.STRING
}
});
return Image;
};