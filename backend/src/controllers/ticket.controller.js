const Ticket = require("../models/ticket.model");
const Comment = require("../models/comment.model");
const ActivityLog = require("../models/activityLog.model");
const asyncHandler = require("../utilities/asyncHandler");
const { logTicketActivity } = require("../services/event.service");

const getTicketAccess = (ticketId, user) => {
    const query = { _id: ticketId };
    if (user.role !== "admin") query.createdBy = user._id;
    return query;
};

const createTicket = asyncHandler(async (req, res) => {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
        return res.status(400).json({ message: "Title, description and category are required" });
    }

    const ticket = await Ticket.create({
        title,
        description,
        category,
        priority: priority || "Medium",
        createdBy: req.user._id
    });

    logTicketActivity({
        ticketId: ticket._id,
        userId: req.user._id,
        action: "Ticket created",
        details: `Ticket "${ticket.title}" was created`
    });

    return res.status(201).json({ success: true, ticket });
});

const getTickets = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const { status, priority, search } = req.query;

    const filter = {};
    if (req.user.role !== "admin") filter.createdBy = req.user._id;
    if (status && status !== "All") filter.status = status;
    if (priority && priority !== "All") filter.priority = priority;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    const [tickets, total] = await Promise.all([
        Ticket.find(filter)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Ticket.countDocuments(filter)
    ]);

    return res.status(200).json({
        success: true,
        tickets,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});

const getTicketById = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findOne(getTicketAccess(req.params.id, req.user))
        .populate("createdBy", "name email");

    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    const [comments, activities] = await Promise.all([
        Comment.find({ ticket: ticket._id })
            .populate("user", "name role")
            .sort({ createdAt: 1 }),
        ActivityLog.find({ ticket: ticket._id })
            .populate("user", "name role")
            .sort({ createdAt: -1 })
            .limit(30)
    ]);

    return res.status(200).json({ success: true, ticket, comments, activities });
});

const updateTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findOne(getTicketAccess(req.params.id, req.user));

    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status === "Resolved" || ticket.status === "Closed") {
        return res.status(400).json({ message: "Resolved or closed tickets cannot be edited" });
    }

    const { title, description, category, priority } = req.body;
    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (category !== undefined) ticket.category = category;
    if (priority !== undefined && req.user.role === "admin") ticket.priority = priority;

    await ticket.save();

    logTicketActivity({
        ticketId: ticket._id,
        userId: req.user._id,
        action: "Ticket updated",
        details: "Ticket information was updated"
    });

    return res.status(200).json({ success: true, ticket });
});

const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findOne(getTicketAccess(req.params.id, req.user));

    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role !== "admin" && ticket.status !== "Open") {
        return res.status(400).json({ message: "Only open tickets can be deleted" });
    }

    await Promise.all([
        ticket.deleteOne(),
        Comment.deleteMany({ ticket: ticket._id }),
        ActivityLog.deleteMany({ ticket: ticket._id })
    ]);

    return res.status(200).json({ success: true, message: "Ticket deleted successfully" });
});

const addComment = asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const ticket = await Ticket.findOne(getTicketAccess(req.params.id, req.user));
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    const comment = await Comment.create({
        ticket: ticket._id,
        user: req.user._id,
        message: message.trim()
    });

    await comment.populate("user", "name role");

    logTicketActivity({
        ticketId: ticket._id,
        userId: req.user._id,
        action: "Comment added",
        details: `${req.user.name} added a comment`
    });

    return res.status(201).json({ success: true, comment });
});

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    addComment
};
