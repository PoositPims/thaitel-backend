const { Resident, Room, BookedDaily, ResidentImg } = require("../models");
const { Op } = require("sequelize");
// import moment from 'moment';
var moment = require("moment");
const translate = require("translate");
exports.getAllData = async (req, res, next) => {
  try {
    const { resident, checkin, roominput } = req.query;
    // console.log(resident);
    // console.log(checkin);
    // console.log(roominput);
    const eng = await translate(`${resident}`, { from: "th", to: "en" });
    // console.log(eng)
    const thai = await translate(`${resident}`, { from: "en", to: "th" });
    // console.log(thai)
    const checkInDate = checkin.split(",")[0].slice(0, 16);
    const checkInDateFormat = new Date(checkInDate);
    const checkOutDate = checkin.split(",")[1].slice(0, 16);
    const checkOutDateFormat = new Date(checkOutDate);
    const residents = await Resident.findAll({
      // where: {
      //   name: { [Op.like]: `%${resident}%` }
      // },
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${eng}%` } },
          { name: { [Op.like]: `%${thai}%` } },
        ],
      },
      include: [
        {
          model: Room,
          include: {
            model: BookedDaily,
            where: {
              date: {
                [Op.between]: [checkInDateFormat, checkOutDateFormat],
              },
            },
            required: false,
          },
        },
        { model: ResidentImg },
      ],
    });
    // console.log(JSON.stringify(residents, null, 2));

    const avail = JSON.parse(JSON.stringify(residents)).filter((item) => {
      for (let room of item.Rooms) {
        const bookedDaily = room.BookedDailies;
        if (bookedDaily.length > 0) {
          const filter = bookedDaily.filter((item) => {
            return item.roomRemaining < roominput;
          });
          if (filter.length > 0) {
            return false;
          } else return true;
        } else {
          if (room.roomAmount > roominput) {
            return true;
          }
        }
      }
    });
    // console.log(JSON.stringify(avail, null, 2));

    // res.json({ residents });
    res.json({ avail });
  } catch (err) {
    next(err);
  }
};
exports.getProvince = async (req, res, next) => {
  try {
    const { province } = req.query;
    // console.log(province);
    const eng = await translate(`${province}`, { from: "th", to: "en" });
    const thai = await translate(`${province}`, { from: "en", to: "th" });
    const residents = await Resident.findAll({
      // where: { province: province },
      where: {
        [Op.or]: [
          { province: { [Op.like]: `%${eng}%` } },
          { province: { [Op.like]: `%${thai}%` } },
        ],
      },
      include: [
        {
          model: Room,
        },
        { model: ResidentImg },
      ],
    });
    // console.log(JSON.stringify(residents, null, 2));
    res.json({ residents });
  } catch (err) {
    next(err);
  }
};
