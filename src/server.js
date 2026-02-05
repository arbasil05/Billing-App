import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import saleRoutes from "./routes/saleRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import dayRoutes from "./routes/dayRoutes.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/days", dayRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT : ${process.env.PORT}`);
    })
})