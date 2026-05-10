const express = require("express");
const router = express.Router();

const {
  getAllExpenses,
  getExpensesByGroup,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

router.get("/", getAllExpenses);
router.get("/group/:groupId", getExpensesByGroup);
router.get("/:id", getExpenseById);
router.post("/", addExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;