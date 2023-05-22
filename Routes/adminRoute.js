const express = require("express");
const router = express.Router();
const auth_controller = require("../Controllers/authController");
const {verifyAdminToken} = require("../utils/verifyToken");

router.post('/register',auth_controller.registerAdmin);
router.post('/login',auth_controller.loginAdmin);
router.post('/forgotpassword',auth_controller.forgotPassword);
router.put('/resetpassword/:token',auth_controller.resetPassword);

module.exports = router ;