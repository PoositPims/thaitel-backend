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
  upload.single("cloudInput"),
  authenticate,
  residentImgConteoller.createResidentImg
);
router.put('/',authenticate,upload.single("cloudInput"),residentImgConteoller.updateResidentImage)

module.exports = router;
