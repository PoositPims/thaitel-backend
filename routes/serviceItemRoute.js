const express = require("express");
const { authenticate } = require("../controllers/hotelOwnerController");
const router = express.Router();
const serviceItemController = require("../controllers/serviceItemConteoller");

router.post(
  "/createServiceId",
  authenticate,
  serviceItemController.createServiceItem
);

module.exports = router;
