const paymentController = require("../controllers/paymentController");
const express = require("express");
const router = express.Router();
const { authenticate } = require("../controllers/userController");

router.post(
  "/request-payment",
  authenticate,
  paymentController.createPaymentReq
);
router.post("/result", paymentController.paymentResult);

module.exports = router;
