const express = require("express");
const { authenticate } = require("../controllers/hotelOwnerController");
const router = express.Router();
const serviceItemController = require("../controllers/serviceItemConteoller");

router.get("/", authenticate, serviceItemController.getAllServiceItem);
router.get("/:id", authenticate, serviceItemController.getServiceItemById);
router.post(
  "/createServiceId",
  authenticate,
  serviceItemController.createServiceItem
);

module.exports = router;
