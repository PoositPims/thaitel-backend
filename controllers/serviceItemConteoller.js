const { ServiceItem } = require("../models");

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
