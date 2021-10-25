const {
  Booking,
  BookingItem,
  Room,
  Resident,
  ServiceItem,
} = require("../models");

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

// สร้างแบบนี้ [{ serviceId: 1, isFree: true, pricePerTime: 0 }, {}]
// สร้างแบบ bilk create

// create
exports.createBooking = async (req, res, next) => {
  try {
    const {
      // name,
      checkInDate,
      checkOutDate,
      serviceFee,
      totalPrice,
      roomId, // primary key
      serviceItemId,
      roomBookingAmount,
    } = req.body;

    const room = await Room.findOne({
      where: {
        id: roomId,
      },
      include: {
        model: Resident,
        required: true,
      },
    });
    // console.log("resident............", room.Resident);
    // console.log("room......................", room);

    // เข้าถึงข้อมูล Service ...........................!!!!!!!!!!!!!!!!!
    const serviceItem = await ServiceItem.findOne({
      where: {
        id: serviceItemId,
      },
    });
    // console.log("serviceItem......................", serviceItem);

    const booking = await Booking.create({
      // name,
      checkInDate,
      checkOutDate,
      serviceFee,
      totalPrice,
      status: "pending",
      userId: req.user.id,
    });

    await BookingItem.create({
      roomId: roomId,
      bookingId: booking.id,
      roomBookingAmount,
    });

    // data ที่เราจะส้่งไป front end (front end ต้องการอะไรบ้าง)
    const result = {
      residentName: room.Resident.name,
      roomType: room.typeOf,
      roomAmount: room.roomAmount,
      dateCheckIn: room.Resident.dateCheckIn,
      dateCheckOut: room.Resident.dateCheckOut,
      pricePerNight: room.pricePerNight,
      serviceFee: serviceItem.pricePerTime,
    };

    res.status(201).json({ result });
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
