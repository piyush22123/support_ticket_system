const express = require("express");
const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    addComment
} = require("../controllers/ticket.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authUser);
router.route("/")
    .post(createTicket)
    .get(getTickets);

router.route("/:id")
    .get(getTicketById)
    .put(updateTicket)
    .delete(deleteTicket);

router.post("/:id/comments", addComment);

module.exports = router;
