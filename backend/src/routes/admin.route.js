const express = require("express");
const { getDashboardStats, updateTicketStatus } = require("../controllers/admin.controller");
const { authUser, authAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authUser, authAdmin);
router.get("/stats", getDashboardStats);
router.patch("/tickets/:id", updateTicketStatus);

module.exports = router;
