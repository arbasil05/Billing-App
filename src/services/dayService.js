import Day from "../models/Day.js";

/**
 * Get all days (Paginated or list)
 */
export const getAllDays = async ({ limit = 30, skip = 0 }) => {
    return Day.find()
        .sort({ date: -1 })
        .skip(Number(skip))
        .limit(Number(limit));
};

/**
 * Get single day by ID
 */
export const getDayById = async (dayId) => {
    const day = await Day.findById(dayId).populate("closedBy", "name");
    if (!day) {
        throw new Error("Day not found");
    }
    return day;
};

/**
 * Close a day
 */
export const closeDay = async ({ dayId, user }) => {
    const day = await Day.findById(dayId);

    if (!day) {
        throw new Error("Day not found");
    }

    if (day.isClosed) {
        throw new Error("Day is already closed");
    }

    day.isClosed = true;
    day.closedBy = user.userId;
    day.closedAt = new Date();

    await day.save();
    return day;
};

/**
 * Update a day manually (Admin Override)
 */
export const updateDay = async ({ dayId, data }) => {
    const day = await Day.findById(dayId);

    if (!day) {
        throw new Error("Day not found");
    }

    Object.assign(day, data);
    
    // Recalculate net if totals are touched manually
    if (data.totalSales !== undefined || data.totalExpenses !== undefined) {
        day.netAmount = day.totalSales - day.totalExpenses;
    }

    await day.save();
    return day;
};
