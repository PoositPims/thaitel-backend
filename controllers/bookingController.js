const {
  Booking,
  BookingItem,
  Room,
  Resident,
  ServiceItem,
  ResidentImg,
  Sequelize,
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

// get all by user id
exports.getByUserId = async (req, res, next) => {
  try {
    // const count = await BookingItem.findAll({
    //   attributes: [
    //     "roomId",
    //     [
    //       Sequelize.fn("SUM", Sequelize.col("room_booking_amount")),
    //       "bookedRoom",
    //     ],
    //   ],
    //   group: ["roomId"],
    // });

    const result = await Booking.findAll({
      attributes: [
        "serviceFee",
        "totalPrice",
        "checkInDate",
        "checkOutDate",
        "id",
        "status",
      ],
      where: {
        userId: req.user.id,
        status: "success",
      },
      include: [
        {
          model: BookingItem,
          attributes: ["roomBookingAmount"],
          include: {
            model: Room,
            attributes: [
              "typeOf",
              // "roomDetail"
              "pricePerNight",
            ],
            include: {
              model: Resident,
              include: { model: ResidentImg, attributes: ["imgUrl"] },
              attributes: [
                "name",
                "timeCheckInStart",
                "timeCheckInEnd",
                "timeCheckOutStart",
                "timeCheckOutEnd",
              ],
            },
          },
        },
      ],
    });

    const resultParse = JSON.parse(JSON.stringify(result));

    const booking = resultParse.map((item) => {
      let resident = {};
      const {
        id,
        serviceFee,
        totalPrice,
        checkInDate,
        checkOutDate,
        BookingItems,
      } = item;
      const rooms = BookingItems.map((room) => {
        const {
          roomBookingAmount,
          Room: {
            typeOf,
            // , roomDetail
            Resident,
          },
        } = room;
        const clone = { ...Resident };
        delete clone.ResidentImgs;
        resident = { ...clone, imgUrl: Resident.ResidentImgs[0].imgUrl };
        return {
          roomBookingAmount,
          typeOf,
          // , roomDetail
        };
      });
      return {
        id,
        serviceFee,
        totalPrice,
        checkInDate,
        checkOutDate,
        rooms,
        resident,
      };
    });

    // console.log("req.user...............", req.user.id);
    // const rooms = await Room.findAll({
    //   where: {
    //     residentId: id,
    //   },
    // });

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
