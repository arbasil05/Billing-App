import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    createExpense,
    fetchExpenses,
    editExpense,
    removeExpense
} from "../controllers/expenseController.js";

const router = express.Router();

router.use(authMiddleware);

// Add new expense
router.post("/", createExpense);

// Get expenses (can filter by ?dayId=...)
router.get("/", fetchExpenses);

// Edit expense
router.put("/:id", editExpense);

// Delete expense
router.delete("/:id", removeExpense);

export default router;
