// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        paymentMethod: {
            type: String,
            default: "cash",
            trim: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        notes: {
            type: String,
            trim: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        businessDay: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Day",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
