const { Resident, Room, BookedDaily } = require("../models");
const { Op } = require("sequelize");

exports.getAllData = async (req, res, next) => {
  try {
    const { resident, checkin, roominput } = req.query;
    // console.log('teesttttttttttttttttt')
    console.log(roominput);
    // console.log(id);
    // console.log(id.resident);
    // const a = id.checkin.split(",");
    // console.log(a);
    // console.log(a[0].slice(0, 16));
    // console.log(a[1].slice(0, 16));
    // const checkin = a[0].slice(0, 16);
    // const checkout = a[1].slice(0, 16);
    // const resident = await Resident.findAll({
    //   where: { name: { [Op.like]: "%pattaya%" } },
    // });

    const checkInDate = checkin.split(",")[0];
    // console.log(22222222222222222222)
    console.log(checkInDate);
    const checkOutDate = checkin.split(",")[1];

    const residents = await Resident.findAll({
      where: { name: { [Op.like]: `%${resident}%` } },
      include: {
        // required: true,// inner join
        model: Room,
        include: {
          model: BookedDaily,
          where: {
            date: {
              [Op.between]: [checkInDate, checkOutDate],
            },
          },
          required: false,
        },
      },
    });

    // console.log(JSON.stringify(residents, null, 2));

    const avail = residents.filter((item) => {
      for (let room of item.Rooms) {
        console.log("11");
        console.log(JSON.stringify(room, null, 2));
        console.log("22");
        // console.log(JSON.stringify(room.BookedDailies, null, 2));

        const bookedDaily = room.BookedDailies;
        if (bookedDaily.length > 0) {
          const filter = bookedDaily.filter((item) => {
            return item.roomRemaining < roominput;
          });
          if (filter.length > 0) {
            return false;
          }
          else return true
          console.log("33");
          console.log(JSON.stringify(filter, null, 2));
        } else {
          if (room.roomAmount > roominput) {
            // console.log("44");
            // console.log(room.roomAmount);
            // console.log("123");
            return true;
          }
        }
      }
    });
    console.log('7272')
    console.log(JSON.stringify(avail, null, 2));

    res.json({ residents });
  } catch (err) {
    next(err);
  }
};
