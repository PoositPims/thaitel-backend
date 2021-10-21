const { Booking } = require("../models");

// get all
exports.getAllBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findAll({});
    res.json({ booking });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.getBookingId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      where: { id },
    });
    res.json({ booking });
  } catch (err) {
    next(err);
  }
};

// create
exports.createBooking = async (req, res, next) => {
  try {
    const { name, checkInDate, checkOutDate, serviceFee, totalPrice, status } =
      req.body;
    const booking = await Booking.create({
      name,
      checkInDate,
      checkOutDate,
      serviceFee,
      totalPrice,
      status,
      userId: req.user.id,
    });
    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
};

// delete
exports.deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await Booking.destroy({
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

// update ยังจำเป็นอยู่ไหม.........
