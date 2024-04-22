const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getSignupPage);
router.post("/signup", userController.signup);
router.get("/login", userController.getLoginPage);
router.post("/login", userController.login);

module.exports = router;
