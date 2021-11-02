const express = require("express");
const router = express.Router();
const roomConteoller = require("../controllers/roomController");
const { authenticate } = require("../controllers/hotelOwnerController");
const { upload } = require("../controllers/residentImgConteoller");

router.get("/", authenticate, roomConteoller.getAllRoom);
router.get("/:id", authenticate, roomConteoller.getRoomById);
router.put("/:id", authenticate, roomConteoller.updateRoom);
router.delete("/:id", authenticate, roomConteoller.deleteRoom);
router.post("/createRoom",upload.single('image-room') ,authenticate, roomConteoller.createRoom);

module.exports = router;
