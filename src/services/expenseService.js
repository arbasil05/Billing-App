import Expense from "../models/Expense.js";
import Day from "../models/Day.js";

/**
 * Add a new expense
 */
export const addExpense = async ({ data, user }) => {
    // 1. Get start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Find or Create Day
    let day = await Day.findOneAndUpdate(
        { date: today },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (day.isClosed && user.role !== "admin") {
        throw new Error("Cannot add expense to a closed day");
    }

    // 3. Create Expense
    const expense = await Expense.create({
        ...data,
        createdBy: user.userId,
        businessDay: day._id
    });

    // 4. Update Day totals
    day.totalExpenses += expense.amount;
    day.netAmount = day.totalSales - day.totalExpenses;
    await day.save();

    return expense;
};

/**
 * Get expenses (Admin: all, Employee: usually filtered by day or permissions)
 * For now, allowing flexible querying.
 */
export const getExpenses = async ({ query = {}, user }) => {
    // If we wanted to restrict employees to only current day, we could do it here
    // But requirement says "admin he can view any expense of any day", implies specific check.
    // Usually standard GET allows filters.
    return Expense.find(query)
        .populate("createdBy", "name")
        .populate("businessDay", "date isClosed")
        .sort({ createdAt: -1 });
};

/**
 * Update an expense
 */
export const updateExpense = async ({ expenseId, data, user }) => {
    const expense = await Expense.findById(expenseId).populate("businessDay");

    if (!expense) {
        throw new Error("Expense not found");
    }

    const day = await Day.findById(expense.businessDay._id);

    // Permission Check: Day Closed
    if (day.isClosed && user.role !== "admin") {
        throw new Error("Cannot edit expense on a closed day");
    }

    // Calculate difference if amount changes
    const oldAmount = expense.amount;
    const newAmount = (data.amount !== undefined) ? Number(data.amount) : oldAmount;
    const diff = newAmount - oldAmount;

    // Update fields
    Object.assign(expense, data);
    await expense.save();

    // Update Day totals if amount changed
    if (diff !== 0) {
        day.totalExpenses += diff;
        day.netAmount = day.totalSales - day.totalExpenses;
        await day.save();
    }

    return expense;
};

/**
 * Delete an expense
 */
export const deleteExpense = async ({ expenseId, user }) => {
    const expense = await Expense.findById(expenseId).populate("businessDay");

    if (!expense) {
        throw new Error("Expense not found");
    }

    const day = await Day.findById(expense.businessDay._id);

    // Permission Check
    if (day.isClosed && user.role !== "admin") {
        throw new Error("Cannot delete expense from a closed day");
    }

    // Update Day Totals
    day.totalExpenses -= expense.amount;
    day.netAmount = day.totalSales - day.totalExpenses;
    await day.save();

    await expense.deleteOne();
};
