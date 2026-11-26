require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env");
        }

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
        if (existingAdmin) {
            console.log("Admin account already exists");
            return;
        }

        const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password,
            role: "admin"
        });

        console.log("Admin account created successfully");
    } catch (error) {
        console.error("Admin seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();
