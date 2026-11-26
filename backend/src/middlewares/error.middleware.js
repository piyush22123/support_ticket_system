const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

const errorHandler = (error, req, res, next) => {
    console.error(error);

    if (error.name === "ValidationError") {
        return res.status(400).json({
            message: Object.values(error.errors).map((item) => item.message).join(", ")
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({ message: "An account with this email already exists" });
    }

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
        message: error.message || "Internal server error"
    });
};

module.exports = { notFound, errorHandler };
