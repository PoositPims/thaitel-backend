const express = require("express");
const router = express.Router();
const residentController = require("../controllers/residentController");
const { authenticate } = require("../controllers/hotelOwnerController");

router.get("/", residentController.getAllResident);
router.get(
  "/getAllResByOwner",
  authenticate,
  residentController.getAllResByOwner
);
router.get("/residentId/:id", residentController.getById);
router.put(
  "/editResident/:id",
  authenticate,
  residentController.updateResident
);
router.delete(
  "/deleteResident/:id",
  authenticate,
  residentController.deleteResident
);
router.post("/createResident", authenticate, residentController.createResident);

module.exports = router;
