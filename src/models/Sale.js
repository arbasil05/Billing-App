import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        pricePerUnit: {
            type: Number,
            required: true,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true
        },

        isUPI: {
            type: Boolean,
            default: false
        },

        soldBy: {
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

export default mongoose.model("Sale", saleSchema);
