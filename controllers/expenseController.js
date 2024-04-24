const Expense = require("../models/expense");
const path = require("path");

exports.getExpensePage = async (req, res, next) => {
  const expensePagePath = path.join(
    __dirname,
    "..",
    "views",
    "expense-form.html"
  );
  res.sendFile(expensePagePath);
};

exports.allExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const allExpenses = await Expense.findAll({ where: { UserId: userId } });
    res.status(200).json({ allExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.submitExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    if (!amount || !description || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Parameters missing" });
    }

    // Create new expense associated with the logged-in user
    const expense = await Expense.create({
      amount,
      description,
      category,
      UserId: req.user.id,
    });

    // Fetch all expenses after adding the new expense
    const allExpenses = await Expense.findAll();

    res.status(201).json({ expense, allExpenses, success: true });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    console.log(expenseId);
    const expense = await Expense.findByPk(expenseId);
    console.log("expenseid", expense.id);
    console.log("expenseUserId", expense.UserId);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    if (expense.UserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this expense",
      });
    }

    await expense.destroy();

    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
