const { Room, Resident } = require("../models");

// get all
exports.getAllRoom = async (req, res, next) => {
  try {
    const room = await Room.findAll({});
    res.json({ room });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findOne({
      where: {
        id,
      },
    });
    // console.log(`id`, id);
    res.json({ room });
  } catch (err) {
    next(err);
  }
};

// create
// ถามพี่แพรอีกที เกี่ยวกับ room ว่าส่งข้อมูลหลายหน้าได้ไหม
exports.createRoom = async (req, res, next) => {
  try {
    const {
      typeOf,
      roomDetail,
      roomAmount,
      size,
      optionalRoomDetail,
      noSmoking,
      petAllowed,
      pricePerNight,
      imgURL,
      maxGuest,
      residentId,
    } = req.body;

    const resident = await Resident.findOne({
      where: { id: residentId, hotelOwnerId: req.hotelOwner.id },
    });
    if (!resident)
      return res
        .status(400)
        .json({ message: "This resident is not own by this hotel owner" });
    const room = await Room.create({
      typeOf,
      roomDetail,
      roomAmount,
      size,
      optionalRoomDetail,
      noSmoking,
      petAllowed,
      pricePerNight,
      imgURL,
      maxGuest,
      residentId,
    });
    res.status(201).json({ room });
  } catch (err) {
    next(err);
  }
};

// update
exports.updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      typeOf,
      roomDetail,
      roomAmount,
      size,
      optionalRoomDetail,
      noSmoking,
      petAllowed,
      pricePerNight,
      imgURL,
      maxGuest,
      residentId,
    } = req.body;
    const [rows] = await Room.update(
      {
        typeOf,
        roomDetail,
        roomAmount,
        size,
        optionalRoomDetail,
        noSmoking,
        petAllowed,
        pricePerNight,
        imgURL,
        maxGuest,
      },
      {
        where: {
          id,
        },
      }
    );
    if (rows === 0)
      return res.status(400).json({ message: "cannot update room" });
    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};

// delete
exports.deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await Room.destroy({
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
