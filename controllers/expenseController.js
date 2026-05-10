const Expense = require("../models/expenses");

const getAllExpenses = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

const getExpensesByGroup = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const expenses = await Expense.find({
      groupId: req.params.groupId,
      userId,
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch group expenses" });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch expense" });
  }
};

const addExpense = async (req, res) => {
  try {
    const { userId, groupId, title, amount, paidBy, splitType, splitAmong, date } = req.body;

    if (!userId || !groupId || !title || !amount || !paidBy) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const expense = new Expense({
      userId,
      groupId,
      title,
      amount,
      paidBy,
      splitType,
      splitAmong,
      date,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { userId, groupId, title, amount, paidBy, splitType, splitAmong, date } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      {
        userId,
        groupId,
        title,
        amount,
        paidBy,
        splitType,
        splitAmong,
        date,
      },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.json(updatedExpense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

module.exports = {
  getAllExpenses,
  getExpensesByGroup,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
};