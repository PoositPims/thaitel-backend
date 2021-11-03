const { Resident, Room, BookedDaily, ResidentImg } = require("../models");
const { Op } = require("sequelize");
// import moment from 'moment';
var moment = require("moment");
exports.getAllData = async (req, res, next) => {
  try {
    const { resident, checkin, roominput } = req.query;
    const checkInDate = checkin.split(",")[0].slice(0, 16);
    const checkInDateFormat = new Date(checkInDate);
    const checkOutDate = checkin.split(",")[1].slice(0, 16);
    const checkOutDateFormat = new Date(checkOutDate);
    const residents = await Resident.findAll({
      where: { name: { [Op.like]: `%${resident}%` } },
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
    console.log(JSON.stringify(residents, null, 2));
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
    console.log(JSON.stringify(avail, null, 2));
    // res.json({ residents });
    res.json({ avail });
  } catch (err) {
    next(err);
  }
};
exports.getProvince = async (req, res, next) => {
  try {
    const { province } = req.query;
    console.log(province);
    const residents = await Resident.findAll({
      where: { province: province },
      include: [
        {
          model: Room,
        },
        { model: ResidentImg },
      ],
    });
    console.log(JSON.stringify(residents, null, 2));
    res.json({ residents });
  } catch (err) {
    next(err);
  }
};
