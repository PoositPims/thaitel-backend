const { HotelOwner } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      return res.status(401).json({ message: "you are unauthorized" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "you are unauthorized" });
    }

    console.log(`token`, token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const hotelOwner = await HotelOwner.findOne({ where: { id: decoded.id } });
    if (!hotelOwner) {
      return res.status(401).json({ message: "you are unauthorized" });
    }
    req.hotelOwner = hotelOwner;
    // console.log("req.hotelOwner...................", req.hotelOwner);
    next();
  } catch (err) {
    next(err);
  }
};

// create (Register owner)
exports.Register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      telephone,
      password,
      idCard,
      idCardImage,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const hotelOwner = await HotelOwner.create({
      firstName,
      lastName,
      email,
      telephone,
      password: hashedPassword,
      idCard,
      idCardImage,
    });
    res.status(201).json({ hotelOwner });
  } catch (err) {
    next(err);
  }
};

// create (Login owner)
exports.Login = async (req, res, next) => {
  try {
    console.log("test");
    const { email, password } = req.body;
    const hotelOwner = await HotelOwner.findOne({ where: { email: email } });
    if (!hotelOwner) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      hotelOwner.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    const payload = {
      id: hotelOwner.id,
      email: hotelOwner.email,
      role: "OWNER",
      firstName: hotelOwner.firstName,
      lastName: hotelOwner.lastName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    console.log(token);
    res.json({ message: "success login", token });
  } catch (err) {
    next(err);
  }
};

// create (Facebook Login......)
exports.ownerFacebookLogin = async (req, res, next) => {
  try {
    const { email, facebookId, firstName, lastName } = req.body;
    const user = await HotelOwner.findOne({
      where: { email, facebookId, firstName, lastName },
    });
    // console.log("user.....................", user);

    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        facebookId: user.facebookId,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24 * 30,
      });
      // console.log("token.....................", token);
      res.json({ message: "success login", token });
    } else if (!user) {
      const user = await HotelOwner.create({
        firstName,
        lastName,
        email,
        facebookId,
      });
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        facebookId: user.facebookId,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24 * 30,
      });
      // console.log("token.....................", token);
      // res.json({ message: "success login", token });
      res.json({ message: "success login", token });
    }
  } catch (err) {
    next(err);
  }
};
