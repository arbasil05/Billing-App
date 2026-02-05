import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// All routes here require Authentication and Admin privileges
router.use(authMiddleware, adminOnly);

// Create a new employee
router.post("/add-employee", createEmployee);

// Get all employees
router.get("/employees", getEmployees);

// Update an employee (or user) by ID
router.put("/:id", updateEmployee);

// Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
