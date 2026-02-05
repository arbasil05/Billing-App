export const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};

export const employeeOrAdmin = (req, res, next) => {
    if (!["admin", "employee"].includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
