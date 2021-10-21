const { RoomNumber } = require("../models");

// get all
exports.getAllRoomNumber = async (req, res, next) => {
  try {
    const roomNumber = await RoomNumber.findAll({});
    res.json({ roomNumber });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.getRoomNumberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const roomNumber = await RoomNumber.findOne({
      where: {
        id,
      },
    });
    // console.log(`id`, id);
    res.json({ roomNumber });
  } catch (err) {
    next(err);
  }
};

// create
exports.createRoomNumber = async (req, res, next) => {
  try {
    const { roomNumber, roomName, roomId } = req.body;
    const roomNo = await RoomNumber.create({
      roomNumber,
      roomName,
      roomId,
    });
    res.json({ roomNo });
  } catch (err) {
    next(err);
  }
};
