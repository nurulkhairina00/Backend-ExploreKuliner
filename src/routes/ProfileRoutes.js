const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken");
const { getUserById, updateUser } = require("../controllers/ProfileController");

router.get("/get-data-user/:id", checkToken, getUserById);
router.post("/update", checkToken, updateUser);

module.exports = router;
