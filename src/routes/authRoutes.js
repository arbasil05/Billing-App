import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import {
    login,
    changePassword,
    resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

// for employees to change their password
router.post("/change-password", authMiddleware, changePassword);

// for admin to change the employee's password
router.post("/reset-password/:userId", authMiddleware, adminOnly, resetPassword);

export default router;
