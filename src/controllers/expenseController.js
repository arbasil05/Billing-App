import {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} from "../services/expenseService.js";

export const createExpense = async (req, res) => {
    try {
        const expense = await addExpense({
            data: req.body,
            user: req.user
        });
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const fetchExpenses = async (req, res) => {
    try {
        const { dayId } = req.query;
        const query = {};
        
        if (dayId) {
            query.businessDay = dayId;
        }

        // Logic check: "admin ... view any expense of any day" 
        // implies maybe employees have restriction? 
        // The prompt says "employee can only add expense on current day", 
        // doesn't explicitly restrict VIEWING past expenses, but it's typical.
        // I will keep it open for now, or you can add `if(user.role !== 'admin') ...` 

        const expenses = await getExpenses({ query, user: req.user });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const editExpense = async (req, res) => {
    try {
        const expense = await updateExpense({
            expenseId: req.params.id,
            data: req.body,
            user: req.user
        });
        res.json(expense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const removeExpense = async (req, res) => {
    try {
        await deleteExpense({
            expenseId: req.params.id,
            user: req.user
        });
        res.json({ message: "Expense removed" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
