import Sale from "../models/Sale.js";
import Day from "../models/Day.js";

/**
 * Create a sale
 */
export const createSale = async ({ data, user }) => {
    // 1. Get start of today (local time or UTC depends on requirement, usually local for simple apps or UTC 00:00)
    // Using simple date stripping for now
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Find or Create Day
    let day = await Day.findOneAndUpdate(
        { date: today },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (day.isClosed && user.role !== "admin") {
        throw new Error("Cannot add sale to a closed day");
    }

    // 3. Create the sale
    const sale = await Sale.create({
        ...data,
        soldBy: user.userId,
        businessDay: day._id
    });

    // 4. Update Day totals
    day.totalSales += sale.totalAmount;
    if (sale.isUPI) {
        day.upiTotal += sale.totalAmount;
    }
    day.netAmount = day.totalSales - day.totalExpenses;
    await day.save();

    return sale;
};

/**
 * Get sales for a business day
 */
export const getSalesByDay = async ({ dayId, user }) => {
    const query = { businessDay: dayId };

    // Employees see only their own sales
    if (user.role === "employee") {
        query.soldBy = user.userId;
    }

    return Sale.find(query).populate("soldBy", "name");
};

/**
 * Update a sale
 */
export const updateSale = async ({ saleId, data, user }) => {
    const sale = await Sale.findById(saleId).populate("businessDay");

    if (!sale) {
        throw new Error("Sale not found");
    }

    // If day is closed, only admin can update
    if (sale.businessDay.isClosed && user.role !== "admin") {
        throw new Error("Cannot update sale for a closed day");
    }

    // Employee can update only their own sales
    if (
        user.role === "employee" &&
        sale.soldBy.toString() !== user.userId
    ) {
        throw new Error("Not authorized to update this sale");
    }

    // Capture old values for day update
    const oldAmount = sale.totalAmount;
    const oldIsUPI = sale.isUPI;

    Object.assign(sale, data);
    await sale.save();

    // Recalculate Day Totals
    const day = await Day.findById(sale.businessDay._id);
    
    // Reverse old values
    day.totalSales -= oldAmount;
    if (oldIsUPI) {
        day.upiTotal -= oldAmount;
    }

    // Add new values
    day.totalSales += sale.totalAmount;
    if (sale.isUPI) {
        day.upiTotal += sale.totalAmount;
    }

    day.netAmount = day.totalSales - day.totalExpenses;
    await day.save();

    return sale;
};

/**
 * Delete a sale (admin only)
 */
export const deleteSale = async ({ saleId }) => {
    const sale = await Sale.findById(saleId).populate("businessDay");

    if (!sale) {
        throw new Error("Sale not found");
    }

    const day = await Day.findById(sale.businessDay._id);

    // Adjust Totals
    day.totalSales -= sale.totalAmount;
    if (sale.isUPI) {
        day.upiTotal -= sale.totalAmount;
    }
    day.netAmount = day.totalSales - day.totalExpenses;
    await day.save();

    await sale.deleteOne();
};
