const express = require("express");

const forgotpassword = require("../controllers/forgotPass");

const router = express.Router();

router.get("/resetpassword/:id", forgotpassword.resetpassword);
router.get("/updatepassword/:resetpasswordid", forgotpassword.updatepassword);
router.post("/forgotpassword", forgotpassword.forgotPass);

module.exports = router;
