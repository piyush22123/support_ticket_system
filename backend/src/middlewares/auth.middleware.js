const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Please login to continue" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("_id name email role");

        if (!user) {
            return res.status(401).json({ message: "User account not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired session" });
    }
};

const authAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

module.exports = { authUser, authAdmin };
