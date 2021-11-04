const { User } = require("../models");
const jwt = require("jsonwebtoken");
exports.Google = async (req, res, next) => {
  try {
    const { email, firstName, lastName, googleId } = req.body;
    const user = await User.findOne({ where: { email, googleId } });
    console.log(JSON.stringify(user, null, 2));
    // console.log(user)
    if (user) {
      // console.log("10");
      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 30 * 60 * 60 * 24,
      });
      res.json({ message: "success logged in", token });
      // console.log(payload);
    } else {
      // console.log("23");
      const userCreate = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        telephone: null,
        password: null,
        role: "CUSTOMER",
        googleId: googleId,
      });
      const payload = {
        id: userCreate.id,
        email: userCreate.email,
        firstName: userCreate.firstName,
        lastName: userCreate.lastName,
        role: userCreate.role,
      };
      // console.log(payload);
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 30 * 60 * 60 * 24,
      });
      res.json({ message: "success logged in", token });
    }
  } catch (err) {
    next(err);
  }
};
