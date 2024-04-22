const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const userauthentication = require("../middleware/auth");

router.get("/", expenseController.getExpensePage);
router.get(
  "/expenses-data",
  userauthentication.authenticate,
  expenseController.allExpenses
);
router.post(
  "/",
  userauthentication.authenticate,
  expenseController.submitExpense
);

module.exports = router;
