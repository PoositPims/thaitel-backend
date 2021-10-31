const express = require("express");
const router = express.Router();
const residentController = require("../controllers/residentController");
const { authenticate } = require("../controllers/hotelOwnerController");

router.get("/", residentController.getAllResident);
router.get("/:id", residentController.getById);
router.put("/:id", authenticate, residentController.updateResident);
router.delete("/:id", authenticate, residentController.deleteResident);
router.post("/createResident", authenticate, residentController.createResident);

module.exports = router;
