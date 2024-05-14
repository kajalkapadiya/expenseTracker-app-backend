const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "expenseTracker",
  "root",
  process.env.SEQ_PASS,
  {
    host: "localhost",
    logging: false,
    dialect: "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
