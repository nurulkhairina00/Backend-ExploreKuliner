const express = require("express");
const router = express.Router();
const {
  login,
  checkGoogle,
  loginGoogle,
} = require("../controllers/LoginController");

router.post("/", login);
router.post("/check-google", checkGoogle);
router.post("/google-signin", loginGoogle);

module.exports = router;
