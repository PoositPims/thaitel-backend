const express = require("express");
const { upload } = require("../controllers/residentImgConteoller");
const router = express.Router();
const residentImgConteoller = require("../controllers/residentImgConteoller");
const { authenticate } = require("../controllers/hotelOwnerController");

router.get("/", authenticate, residentImgConteoller.getAllResident);
router.get("/:id", authenticate, residentImgConteoller.getResidentImgById);
router.delete("/:id", authenticate, residentImgConteoller.deleteResidentImg);
router.post(
  "/",
  upload.array("cloudInput"),
  authenticate,
  residentImgConteoller.createResidentImg
);

module.exports = router;