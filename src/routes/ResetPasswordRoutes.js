const express = require("express");
const router = express.Router();
const {
  resetPassword,
  verifyResetPassword,
  verifyToken,
} = require("../controllers/ResetPasswordController");

router.post("/", resetPassword);
router.get("/verify/:token", verifyResetPassword);
router.post("/verify-token", verifyToken);

module.exports = router;
