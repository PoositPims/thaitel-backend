const express = require("express");
const router = express.Router();
const googleController = require("../controllers/googleController");
router.post("/", googleController.Google);


module.exports = router;