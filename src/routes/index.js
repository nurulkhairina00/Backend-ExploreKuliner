const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");

router.use("/login", loginRoutes);

module.exports = router;
