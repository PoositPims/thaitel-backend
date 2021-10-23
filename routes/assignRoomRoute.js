const express = require("express");
const router = express.Router();
const { authenticate } = require("../controllers/hotelOwnerController");
const assignRoomController = require("../controllers/assignRoomController");

router.get("/", authenticate, assignRoomController.getAllAssignRoom);
router.post("/", authenticate, assignRoomController.createAssignRoom);

module.exports = router;
