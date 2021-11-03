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

// get all
exports.getAllResident = async (req, res, next) => {
  try {
    const residentImg = await ResidentImg.findAll({});
    res.json({ residentImg });
  } catch (err) {
    next(err);
  }
};

//get by id
exports.getResidentImgById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const residentImg = await ResidentImg.findOne({
      where: { id },
    });
    res.status({ residentImg });
  } catch (err) {
    next(err);
  }
};

// create
exports.createResidentImg = async (req, res, next) => {
  try {
    const { residentId } = req.body;
    const result = await uploadPromise(req.file.path);
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

exports.updateResidentImage = async (req,res,next)=>{
  try {
    const { residentId } = req.body;
    if(req.file){
      const result = await uploadPromise(req.file.path);
      const residentImg = await ResidentImg.update({
        imgUrl: result.secure_url,
      },{
        where:{residentId}
      });
      fs.unlinkSync(req.file.path);
      return res.status(200).json({  message : 'Update success'  });
    } else {
      return res.json({ message : 'Update success' });
    }
  } catch (err) {
    next(err);
  }
}

// update ต้องมีไหม ........... !!!!!!!

// delete
exports.deleteResidentImg = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await ResidentImg.destroy({
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
