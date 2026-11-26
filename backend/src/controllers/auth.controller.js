const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const generateToken = require("../utilities/tokenGenerator");
const asyncHandler = require("../utilities/asyncHandler");

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SECURE === "true" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
});

const sendUser = (res, user, statusCode = 200) => {
    const token = generateToken(user);
    res.cookie("accessToken", token, cookieOptions());

    return res.status(statusCode).json({
        success: true,
        message: statusCode === 201 ? "Account created successfully" : "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must contain at least 8 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
        return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user"
    });

    return sendUser(res, user, 201);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    return sendUser(res, user);
});

const logoutUser = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SECURE === "true" ? "none" : "lax",
        path: "/"
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
};

const getMe = (req, res) => {
    return res.status(200).json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
