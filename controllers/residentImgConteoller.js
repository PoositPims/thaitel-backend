const { ResidentImg } = require("../models");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const util = require("util"); // แปลง callback ให้เป็น promise
const fs = require("fs");
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

// create
exports.createResidentImg = async (req, res, next) => {
  try {
    const { residentId } = req.body;
    const result = await uploadPromise(req.file.path);
    console.log(result.secure_url, "tuyuyuyuyuyuyuyu");
    const residentImg = await ResidentImg.create({
      imgUrl: result.secure_url,
      residentId,
    });
    fs.unlinkSync(req.file.path);
    res.json({ residentImg });
  } catch (err) {
    next(err);
  }
};
