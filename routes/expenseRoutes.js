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
router.delete(
  "/:expenseId",
  userauthentication.authenticate,
  expenseController.deleteExpense
);
router.get(
  "/download",
  userauthentication.authenticate,
  expenseController.downloadExpenses
);

// router.get(
//   "/daily",
//   userauthentication.authenticate,
//   expenseController.dailyExpenses
// );

module.exports = router;
