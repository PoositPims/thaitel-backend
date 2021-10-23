const { AssignRoom } = require("../models");

// get all
exports.getAllAssignRoom = async (req, res, next) => {
  try {
    const assignRoom = await AssignRoom.findAll({});
    res.json({ assignRoom });
  } catch (err) {
    next(err);
  }
};

// create
exports.createAssignRoom = async (req, res, next) => {
  try {
    const { checkInDate, checkOutDate, roomNumberId, bookingItemId } = req.body;
    const assignRoom = await AssignRoom.create({
      checkInDate,
      checkOutDate,
      roomNumberId,
      bookingItemId,
    });
    res.json({ assignRoom });
  } catch (err) {
    next(err);
  }
};
