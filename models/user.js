const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("./index");
const Expense = require("./expense");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
  },
  { ispremiumuser: Sequelize.BOOLEAN }
);

// Define association
// User.hasOne(Expense);

module.exports = User;
