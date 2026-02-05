import mongoose from "mongoose";

const daySchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            unique: true
        },

        isClosed: {
            type: Boolean,
            default: false
        },

        totalSales: {
            type: Number,
            default: 0
        },

        upiTotal: {
            type: Number,
            default: 0
        },

        totalExpenses: {
            type: Number,
            default: 0
        },

        netAmount: {
            type: Number,
            default: 0
        },

        closedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        closedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Day", daySchema);
