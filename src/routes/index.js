const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const registerRoutes = require("./RegisterRoutes");

router.use("/login", loginRoutes);
router.use("/register", registerRoutes);

module.exports = router;
