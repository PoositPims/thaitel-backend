const { Resident, Room } = require("../models");

// get all resident
exports.getAllResident = async (req, res, next) => {
  try {
    const resident = await Resident.findAll({});
    // console.log("resident...............", resident);
    res.json({ resident });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resident = await Resident.findOne({
      where: {
        id: id,
      },
      // include: [
      //   {
      //     model: Room,
      //   },
      // ],
    });
    // console.log("id........................", id);
    res.json({ resident });
  } catch (err) {
    next(err);
  }
};

// create
exports.createResident = async (req, res, next) => {
  try {
    const {
      typeOf,
      name,
      rateStar,
      address,
      subDistrict,
      district,
      province,
      postalCode,
      dateCheckIn,
      dateCheckOut,
      canCancle,
      hotelOwnerId,
    } = req.body;

    const dateForCheckIn = new Date(dateCheckIn);
    const dateForCheckOut = new Date(dateCheckOut);

    // console.log("dateForCheckIn................", dateForCheckIn);

    const resident = await Resident.create({
      typeOf,
      name,
      rateStar,
      address,
      subDistrict,
      district,
      province,
      postalCode,
      dateCheckIn: dateForCheckIn,
      dateCheckOut: dateForCheckOut,
      canCancle,
      hotelOwnerId: req.hotelOwner.id,
    });
    res.status(201).json({ resident });
  } catch (err) {
    next(err);
  }
};

// delete (ลบโรงแรมได้ดีมั้ย..............................???)
exports.deleteResident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await Resident.destroy({
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

// update resident ( update โรงแรมได้ด้วยดีมั้ย..............................???)
exports.updateResident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      typeOf,
      name,
      rateStar,
      address,
      subDistrict,
      district,
      province,
      postalCode,
      dateCheckIn,
      dateCheckOut,
      canCancle,
      hotelOwnerId,
    } = req.body;
    const [rows] = await Resident.update(
      {
        typeOf,
        name,
        rateStar,
        address,
        subDistrict,
        district,
        province,
        postalCode,
        dateCheckIn,
        dateCheckOut,
        canCancle,
      },
      {
        where: { id },
      }
    );
    if (rows === 0) {
      return res.status(400).json({ message: "cannot update room" });
    }
    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};
