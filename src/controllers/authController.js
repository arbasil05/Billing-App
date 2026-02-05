import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
        userId: user._id,
        role: user.role
    });

    res.json({
        token,
        role: user.role
    });
};


export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId).select("+password");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
};

export const resetPassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
};


