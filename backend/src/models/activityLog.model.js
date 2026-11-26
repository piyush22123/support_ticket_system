const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
