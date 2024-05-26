const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("expenseTracker", "root", "12345678", {
  host: "localhost",
  logging: false,
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
