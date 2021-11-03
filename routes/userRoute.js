const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.Register);
router.post("/reset-password", userController.resetPassword);
router.post("/new-password", userController.newPassword);
router.post("/login", userController.Login);
router.post("/facebookLogin", userController.facebookLogin);

module.exports = router;
