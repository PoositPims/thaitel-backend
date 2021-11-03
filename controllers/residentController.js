const {
  Resident,
  Room,
  ResidentImg,
  ServiceItem,
  BookingItem,
  Rooms,
  Service,
  BankAccount
} = require("../models");

// get all resident
exports.getAllResident = async (req, res, next) => {
  try {
    const resident = await Resident.findAll({
      include: [
        {
          model: ResidentImg,
        },
        {
          model: Room,
        },
      ],

      // include: ResidentImg,
    });
    // const rooms = await Room.findAll({
    //   where: {
    //     residentId: id,
    //   },
    // });
    res.json({ resident });
    // console.log("resident...............", JSON.stringify(resident, null, 2));
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
      include: [
        {
          model: ResidentImg,
          attributes: ["imgUrl"],
        },
        {
          model: ServiceItem,
        },{
          model:BankAccount
        }
      ],
    });

    const resultRoom = await Room.findAll({
      where: {
        residentId: id,
      },
      include: {
        model: BookingItem,
        attributes: ["roomBookingAmount"],
      },
    });

    const resultRoomParse = JSON.parse(JSON.stringify(resultRoom));

    const rooms = resultRoomParse.map((room) => {
      const {
        BookingItems,
      } = room;
      const countBookedRoom = BookingItems.reduce(
        (a, c) => a + c.roomBookingAmount,
        0
      );
      return {
        ...room,
        countBookedRoom,
      };
    });

    // console.log("id........................", id);
    res.json({ resident, rooms });
    // console.log(JSON.stringify(tasks, null, 2));
    // console.log("resident...............", JSON.stringify(resident, null, 2));
  } catch (err) {
    next(err);
  }
};

// getAllResByOwner
exports.getAllResByOwner = async (req, res, next) => {
  try {
    // console.log("test................");
    // console.log("req.hotelOwner...............", req.hotelOwner);
    const resident = await Resident.findAll({
      attributes: [
        "id",
        "typeOf",
        "name",
        "timeCheckInStart",
        "timeCheckInEnd",
        "timeCheckOutStart",
        "timeCheckOutEnd",
        "province",
        "description",
      ],
      where: {
        hotelOwnerId: req.hotelOwner.id,
      },
      include: [
        {
          model: ResidentImg,
          attributes: ["imgUrl"],
        },
        {
          model: ServiceItem,
          attributes: ["serviceName", "pricePerTime"],
        },
        {
          model: Room,
          include: {
            model: BookingItem,
            attributes: ["roomBookingAmount"],
          },
        },
      ],
    });

    // const bookedRoomCount = BookingItem.map((item) => {});

    const resultParse = JSON.parse(JSON.stringify(resident));

    // console.log("resultParse...............", resultParse);

    const resultResident = resultParse.map((item) => {
      const {
        id,
        typeOf,
        name,
        timeCheckInStart,
        timeCheckInEnd,
        timeCheckOutStart,
        timeCheckOutEnd,
        province,
        description,
        ResidentImgs,
        Rooms,
        ServiceItems,
      } = item;
      //   // const imgUrl = Resident.ResidentImgs[0].imgUrl;
      const rooms = Rooms.map((room) => {
        const {
          BookingItems,
        } = room;
        const countBookedRoom = BookingItems.reduce(
          (a, c) => a + c.roomBookingAmount,
          0
        );
        return {
          ...room,
          countBookedRoom,
        };
      });
      return {
        id,
        typeOf,
        name,
        timeCheckInStart,
        timeCheckInEnd,
        timeCheckOutStart,
        timeCheckOutEnd,
        province,
        description,
        rooms,
        ServiceItems,
        // imgUrl: ResidentImgs[0].imgUrl,
        imgUrl: ResidentImgs[0]?.imgUrl || null,
      };
    });

    // console.log("resultResident........................", resultResident);
    res.json({
      // resident,
      resultResident,
    });
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
      timeCheckInStart,
      timeCheckInEnd,
      timeCheckOutStart,
      timeCheckOutEnd,
      canCancle,
      discription,
      hotelOwnerId,
      services, // [{ serviceId: 1, isFree: true, pricePerTime: 0 }, { serviceId: 2, isFree: false, pricePerTime: 100 }]
      // ให้หน้าบ้านส่งมาแบบนี้ (services).............. !!!!!!!!!!!!!!!!!!!!
    } = req.body;
    // const dateForCheckIn = new Date(dateCheckIn);
    // const dateForCheckOut = new Date(dateCheckOut);

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
      timeCheckInStart,
      timeCheckInEnd,
      timeCheckOutStart,
      timeCheckOutEnd,
      // dateCheckIn: dateForCheckIn,
      // dateCheckOut: dateForCheckOut,
      canCancle,
      discription,
      hotelOwnerId: req.hotelOwner.id,
      services,
    });

    // สร้างแบบนี้ [{ serviceId: 1, isFree: true, pricePerTime: 0 }, {}]
    const serviceItemToCreate = services.map((item) => {
      let items = {};
      items.serviceName = item.serviceName;
      items.residentId = resident.id;
      items.isFree = item.isFree;
      items.pricePerTime = item.pricePerTime;
      items.isHaving = item.isHaving;
      return items;
    });

    // ServiceItem.create({
    //   serviceId: 1,
    //   residentId: resident.id,
    //   isFree: true,
    //   pricePerTime: 0,
    // });
    await ServiceItem.bulkCreate(serviceItemToCreate);

    res.status(201).json({ resident });
  } catch (err) {
    next(err);
  }
};

// delete (ลบโรงแรมได้ดีมั้ย..............................???)
exports.deleteResident = async (req, res, next) => {
  try {
    console.log("test....................");
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
      timeCheckInStart,
      timeCheckInEnd,
      timeCheckOutStart,
      timeCheckOutEnd,
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
        timeCheckInStart,
        timeCheckInEnd,
        timeCheckOutStart,
        timeCheckOutEnd,
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
