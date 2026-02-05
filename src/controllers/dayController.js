import {
    getAllDays,
    getDayById,
    closeDay,
    updateDay
} from "../services/dayService.js";

export const getDays = async (req, res) => {
    try {
        const { limit, skip } = req.query;
        const days = await getAllDays({ limit, skip });
        res.json(days);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDay = async (req, res) => {
    try {
        const day = await getDayById(req.params.id);
        res.json(day);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const markDayClosed = async (req, res) => {
    try {
        const day = await closeDay({
            dayId: req.params.id,
            user: req.user
        });
        res.json(day);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const editDay = async (req, res) => {
    try {
        const day = await updateDay({
            dayId: req.params.id,
            data: req.body
        });
        res.json(day);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
