const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoute = require("./routes/auth.route");
const ticketRoute = require("./routes/ticket.route");
const adminRoute = require("./routes/admin.route");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        const normalizedOrigin = origin ? origin.replace(/\/$/, "") : origin;

        if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Support Ticket API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Support Ticket API is healthy"
    });
});

app.use("/api/auth", authRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/admin", adminRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
