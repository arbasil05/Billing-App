import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import {
    getDays,
    getDay,
    markDayClosed,
    editDay
} from "../controllers/dayController.js";

const router = express.Router();

router.use(authMiddleware);

// Get all days (Admin view mostly)
router.get("/", adminOnly, getDays);

// Get single day
router.get("/:id", adminOnly, getDay);

// Close Day
router.post("/:id/close", adminOnly, markDayClosed);

// Edit Day (Manual Override)
router.put("/:id", adminOnly, editDay);

export default router;
