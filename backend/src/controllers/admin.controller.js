const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const asyncHandler = require("../utilities/asyncHandler");
const { logTicketActivity } = require("../services/event.service");

const getDashboardStats = asyncHandler(async (req, res) => {
    const [total, open, inProgress, resolved, closed, users] = await Promise.all([
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: "Open" }),
        Ticket.countDocuments({ status: "In Progress" }),
        Ticket.countDocuments({ status: "Resolved" }),
        Ticket.countDocuments({ status: "Closed" }),
        User.countDocuments({ role: "user" })
    ]);

    return res.status(200).json({
        success: true,
        stats: { total, open, inProgress, resolved, closed, users }
    });
});

const updateTicketStatus = asyncHandler(async (req, res) => {
    const { status, priority } = req.body;
    const allowedStatus = ["Open", "In Progress", "Resolved", "Closed"];
    const allowedPriority = ["Low", "Medium", "High", "Urgent"];

    if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid ticket status" });
    }
    if (priority && !allowedPriority.includes(priority)) {
        return res.status(400).json({ message: "Invalid ticket priority" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const oldStatus = ticket.status;
    if (status) {
        ticket.status = status;
        ticket.resolvedAt = status === "Resolved" ? new Date() : null;
    }
    if (priority) ticket.priority = priority;

    await ticket.save();

    logTicketActivity({
        ticketId: ticket._id,
        userId: req.user._id,
        action: status === "Resolved" ? "Ticket resolved" : "Ticket status changed",
        details: `Status changed from ${oldStatus} to ${ticket.status}`
    });

    return res.status(200).json({ success: true, ticket });
});

module.exports = { getDashboardStats, updateTicketStatus };
