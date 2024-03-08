const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const registerRoutes = require("./RegisterRoutes");
const profileRoutes = require("./ProfileRoutes");

router.use("/login", loginRoutes);
router.use("/register", registerRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
