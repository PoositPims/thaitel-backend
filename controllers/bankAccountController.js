const { BankAccount } = require("../models");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const util = require("util"); // แปลง callback ให้เป็น promise
const uploadPromise = util.promisify(cloudinary.uploader.upload);

exports.upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
    },
  }),
});

//get all
exports.getAllBankAccount = async (req, res, next) => {
  try {
    const bankAccount = await BankAccount.findAll({});
    res.json({ bankAccount });
  } catch (err) {
    next(err);
  }
};

//get by id
exports.getBankAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bankAccount = await BankAccount.findOne({
      where: { id },
    });
    res.status({ bankAccount });
  } catch (err) {
    next(err);
  }
};

// create
exports.createBankAccount = async (req, res, next) => {
  try {
    const { bankName, AccountNumber, AccountName, imageIdURL, residentId } =
      req.body;
    const result = await uploadPromise(req.file.path);
    const bankAccount = await BankAccount.create({
      bankName,
      AccountNumber,
      AccountName,
      imageIdURL: result.secure_url,
      residentId,
    });
    fs.unlinkSync(req.file.path);
    res.status(201).json({ bankAccount });
  } catch (err) {
    next(err);
  }
};

// delete
exports.deleteBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await BankAccount.destroy({
      where: { id },
    });
    if (rows === 0) {
      return res.status(400).json({ message: "cannot delete" });
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

// update
exports.updateBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bankName, AccountNumber, AccountName, imageIdURL, residentId } =
      req.body;
    const [rows] = await BankAccount.update(
      {
        bankName,
        AccountNumber,
        AccountName,
        imageIdURL,
      },
      {
        where: {
          id,
        },
      }
    );
    if (rows === 0)
      return res.status(400).json({ message: "cannot update Bank Account" });
    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};
