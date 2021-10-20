const { HotelOwner } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
