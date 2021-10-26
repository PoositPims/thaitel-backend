const { Resident } = require("../models");
const { Op } = require("sequelize");
exports.getAllData = async (req, res, next) => {
    try {
       const id= req.query
       console.log(id)
       console.log(id.resident)
      const resident = await Resident.findAll({
          where:{name:{[Op.like]:'%pattaya%'}}
      });
      res.json({ resident });
    } catch (err) {
      next(err);
    }
  };