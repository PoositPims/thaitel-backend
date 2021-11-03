const express = require("express");
const router = express.Router();
const { upload } = require("../controllers/bankAccountController");
const { authenticate } = require("../controllers/hotelOwnerController");
const bankAccountController = require("../controllers/bankAccountController");

router.get("/", authenticate, bankAccountController.getAllBankAccount);
router.get("/:id", authenticate, bankAccountController.getBankAccountById);
router.put("/:id", authenticate,upload.single("cloudInput"), bankAccountController.updateBankAccount);
router.delete("/:id", authenticate, bankAccountController.deleteBankAccount);
router.post(
  "/",
  authenticate,
  upload.single("cloudInput"),
  bankAccountController.createBankAccount
);

module.exports = router;
