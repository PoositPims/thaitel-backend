const { ServiceItem } = require("../models");

// get
exports.getAllServiceItem = async (req, res, next) => {
  try {
    const serviceItem = await ServiceItem.findAll({});
    res.json({ serviceItem });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.getServiceItemById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const serviceItem = await ServiceItem.findOne({
      where: {
        id: id,
      },
    });
    res.json({ serviceItem });
  } catch (err) {
    next(err);
  }
};

// create
exports.createServiceItem = async (req, res, next) => {
  try {
    const { residentId, serviceId } = req.body;
    // const serviceItem = await ServiceItem.fineObe({
    //   where: { id: residentId },
    // });
    const serviceItem = await ServiceItem.create({
      residentId,
      serviceId,
    });
    res.status(201).json({ serviceItem });
  } catch (err) {
    next(err);
  }
};
