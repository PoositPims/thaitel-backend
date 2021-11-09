const { User } = require("../models");
const jwt = require("jsonwebtoken");
exports.Google = async (req, res, next) => {
  try {
    const { email, firstName, lastName, googleId } = req.body;
    const user = await User.findOne({
      where: { email, googleId, firstName, lastName },
    });
    console.log(JSON.stringify(user, null, 2));
    // console.log(user)
    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        googleId: user.googleId,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24 * 30,
      });
      res.json({ message: "success logged in", token });
      // console.log(payload);
    } else if (!user) {
      // console.log("23");
      const userCreate = await User.create({
        firstName,
        lastName,
        email,
        telephone: null,
        password: null,
        // role: "CUSTOMER",
        googleId,
      });
      const payload = {
        // id: userCreate.id,
        // email: userCreate.email,
        // firstName: userCreate.firstName,
        // lastName: userCreate.lastName,
        // role: userCreate.role,
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        googleId: user.googleId,
      };
      // console.log(payload);
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24 * 30,
      });
      res.json({ message: "success logged in", token });
    }
  } catch (err) {
    next(err);
  }
};
