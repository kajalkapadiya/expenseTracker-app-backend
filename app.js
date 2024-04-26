const express = require("express");
const bodyParser = require("body-parser");
require("./models/index");
const app = express();
const sequelize = require("./models/index");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const path = require("path");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "views")));

User.hasMany(Expense); // user has many expenses
Expense.belongsTo(User); // but expense belong to only one user

User.hasMany(Order);
Order.belongsTo(User);

// Sync Sequelize models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Sequelize models synchronized with the database");
  })
  .catch((error) => {
    console.error("Error synchronizing Sequelize models:", error);
  });

//routes
app.use("/", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
