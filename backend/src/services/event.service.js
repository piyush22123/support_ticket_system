const EventEmitter = require("events");
const ActivityLog = require("../models/activityLog.model");

const ticketEvents = new EventEmitter();

const registerEventListeners = () => {
    ticketEvents.on("ticketActivity", async (data) => {
        try {
            await ActivityLog.create({
                ticket: data.ticketId,
                user: data.userId,
                action: data.action,
                details: data.details || ""
            });
        } catch (error) {
            console.error("Unable to save activity log:", error.message);
        }
    });
};

const logTicketActivity = (data) => {
    ticketEvents.emit("ticketActivity", data);
};

module.exports = { registerEventListeners, logTicketActivity };
