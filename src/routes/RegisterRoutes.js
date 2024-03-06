const express = require("express");
const router = express.Router();
const {
  register,
  registerGoogle,
  verifyRegister,
  verifyToken,
} = require("../controllers/RegisterController");

router.post("/", register);
router.post("/register-google", registerGoogle);
router.get("/verify/:token", verifyRegister);
router.post("/verify-token", verifyToken);

module.exports = router;
