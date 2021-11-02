const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate } = require("../controllers/userController");

router.get("/", authenticate, bookingController.getAllBooking);
router.get("/getByUserId", authenticate, bookingController.getByUserId);
router.post("/", authenticate, bookingController.createBooking);
router.delete("/:id", authenticate, bookingController.deleteBooking);
// update ยังจำเป็นอยู่ไหม.........

module.exports = router;
