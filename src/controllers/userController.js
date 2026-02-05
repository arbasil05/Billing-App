import User from "../models/User.js";

// @desc    Create a new employee
// @route   POST /api/users/add-employee
// @access  Admin
export const createEmployee = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password, 
            role: "employee",
            isActive: true
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get all employees
// @route   GET /api/users/employees
// @access  Admin
export const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" }).select("-password");
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update employee details
// @route   PUT /api/users/:id
// @access  Admin
export const updateEmployee = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin" && req.user.userId !== user._id.toString()) {
             // Optional safety: Prevent admin from accidentally modifying other admins if you have multiple
             // For now assuming single super admin or allowed.
             // Let's stick to modifying employees primarily as per request, but general user update is fine.
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.isActive !== undefined) {
            user.isActive = req.body.isActive;
        }

        // If password is being updated directly here (optional, usually done via reset-password)
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isActive: updatedUser.isActive
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Prevent deleting self
        if (user._id.toString() === req.user.userId) {
             return res.status(400).json({ message: "Cannot delete yourself" });
        }

        await user.deleteOne();
        res.json({ message: "User removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
