const express = require("express");
const router = express.Router();
const hotelOwnerController = require("../controllers/hotelOwnerController");

router.post("/register", hotelOwnerController.Register);
router.post("/login", hotelOwnerController.Login);
router.post("/ownerFacebookLogin", hotelOwnerController.ownerFacebookLogin);

module.exports = router;
