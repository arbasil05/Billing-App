import {
    createSale,
    getSalesByDay,
    updateSale,
    deleteSale
} from "../services/saleService.js";

export const addSale = async (req, res) => {
    try {
        const sale = await createSale({
            data: req.body,
            user: req.user
        });

        res.status(201).json(sale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const fetchSalesByDay = async (req, res) => {
    try {
        const sales = await getSalesByDay({
            dayId: req.params.dayId,
            user: req.user
        });

        res.json(sales);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const editSale = async (req, res) => {
    try {
        const sale = await updateSale({
            saleId: req.params.saleId,
            data: req.body,
            user: req.user
        });

        res.json(sale);
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
};

export const removeSale = async (req, res) => {
    try {
        await deleteSale({ saleId: req.params.saleId });
        res.json({ message: "Sale deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
