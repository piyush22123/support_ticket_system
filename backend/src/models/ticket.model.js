const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 120
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 5000
    },
    category: {
        type: String,
        required: true,
        enum: ["Technical", "Account", "Billing", "General", "Other"]
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resolvedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

ticketSchema.index({ title: "text", description: "text" });
ticketSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Ticket", ticketSchema);
