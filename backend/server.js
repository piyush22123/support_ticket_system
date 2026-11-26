require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/services/db");
const { registerEventListeners } = require("./src/services/event.service");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        registerEventListeners();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
