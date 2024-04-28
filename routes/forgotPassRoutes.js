const express = require("express");

const forgotpassword = require("../controllers/forgotPass");

const router = express.Router();

router.post("/forgotpassword", forgotpassword.forgotPass);

module.exports = router;
