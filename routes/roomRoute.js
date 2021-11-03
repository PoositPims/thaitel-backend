const express = require("express");
const { upload } = require("../controllers/roomController");

const router = express.Router();
const roomConteoller = require("../controllers/roomController");
const { authenticate } = require("../controllers/hotelOwnerController");

router.get("/", roomConteoller.getAllRoom);
router.get("/:id", roomConteoller.getRoomById);
router.put("/:id", authenticate,upload.single("cloudInput"), roomConteoller.updateRoom);
router.delete("/:id", authenticate, roomConteoller.deleteRoom);
router.post(
  "/createRoom",
  authenticate,
  upload.single("cloudInput"),
  roomConteoller.createRoom
);

module.exports = router;
