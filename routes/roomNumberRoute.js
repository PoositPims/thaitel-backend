const express = require("express");
const router = express.Router();
const roomNumberController = require("../controllers/roomNumberController");
const { authenticate } = require("../controllers/hotelOwnerController");

// เลขห้องเอาแค้นี้เพราะ เลขห้องน่าจะไม่จำเป็นต้อง ลบ และ แก้ไข
router.get("/", authenticate, roomNumberController.getAllRoomNumber);
router.get("/:id", authenticate, roomNumberController.getRoomNumberById);
router.post("/", authenticate, roomNumberController.createRoomNumber);

module.exports = router;
