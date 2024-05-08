const Expense = require("../models/expense");
const path = require("path");
const User = require("../models/user");
const sequelize = require("../models/index");
const { Op } = require("sequelize");

exports.getExpensePage = async (req, res, next) => {
  const expensePagePath = path.join(
    __dirname,
    "..",
    "views",
    "expense-form.html"
  );
  res.sendFile(expensePagePath);
};

// exports.allExpenses = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const allExpenses = await Expense.findAll({ where: { UserId: userId } });
//     res.status(200).json({ allExpenses });
//   } catch (error) {
//     console.error("Error fetching expenses:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

exports.allExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameters, default to 1
    const perPage = parseInt(req.query.perPage); // Number of expenses per page
    const offset = (page - 1) * perPage; // Calculate the offset

    console.log(perPage);
    const allExpenses = await Expense.findAndCountAll({
      where: { UserId: userId },
      limit: perPage,
      offset: offset,
      order: [["createdAt", "ASC"]], // Assuming createdAt is the date field
    });

    const totalExpense = await Expense.findAndCountAll({
      where: { UserId: userId },
    });
    const totalPages = Math.ceil(totalExpense.count / perPage);

    // Group expenses by month
    const expensesByMonth = {};
    allExpenses.rows.forEach((expense) => {
      const monthYear = expense.createdAt.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!expensesByMonth[monthYear]) {
        expensesByMonth[monthYear] = [];
      }
      expensesByMonth[monthYear].push(expense);
    });

    res.status(200).json({ expensesByMonth, totalPages });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.submitExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const t = await sequelize.transaction();

  try {
    if (!amount || !description || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Parameters missing" });
    }

    // Create new expense associated with the logged-in user
    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        UserId: req.user.id,
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    console.log(totalExpense);

    // Update the total expenses of the user
    await User.update(
      {
        totalExpenses: totalExpense,
      },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    // Commit the transaction
    await t.commit();

    // Fetch all expenses after adding the new expense
    const allExpenses = await Expense.findAll();

    // Send response
    res.status(201).json({ expense, allExpenses, success: true });
  } catch (error) {
    console.error("Error adding expense:", error);
    // Rollback the transaction if an error occurred
    await t.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const expense = await Expense.findByPk(expenseId);

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

exports.downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.findAll({ where: { userId } });

    const expensesAsCsv = expenses
      .map(
        (expense) =>
          `${expense.amount},${expense.description},${expense.category}`
      )
      .join("\n");

    // Send the file as a response
    res.setHeader("Content-Disposition", 'attachment; filename="expenses.csv"'); // Set file name
    res.setHeader("Content-Type", "text/csv"); // Set content type
    res.send(expensesAsCsv); // Send CSV data
  } catch (error) {
    console.error("Error exporting expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
