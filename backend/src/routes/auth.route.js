const express = require("express");
const { registerUser, loginUser, logoutUser, getMe } = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authUser, logoutUser);
router.get("/me", authUser, getMe);

module.exports = router;
