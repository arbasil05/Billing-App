import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import {
    addSale,
    fetchSalesByDay,
    editSale,
    removeSale
} from "../controllers/saleController.js";

const router = express.Router();

// Create sale (employee or admin)
router.post(
    "/",
    authMiddleware,
    addSale
);

// Get sales for a business day
router.get(
    "/day/:dayId",
    authMiddleware,
    fetchSalesByDay
);

// Update sale (employee: own & day open, admin: always)
router.put(
    "/:saleId",
    authMiddleware,
    editSale
);

// Delete sale (admin only)
router.delete(
    "/:saleId",
    authMiddleware,
    adminOnly,
    removeSale
);

export default router;
