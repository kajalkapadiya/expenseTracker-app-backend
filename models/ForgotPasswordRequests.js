const Sequelize = require("sequelize");
const sequelize = require("./index");

//id, name , password, phone number, role

const Forgotpassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.BOOLEAN,
  expiresby: Sequelize.DATE,
});

module.exports = Forgotpassword;
