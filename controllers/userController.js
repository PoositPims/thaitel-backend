const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "tryitfordevelop@gmail.com",
    pass: "0925249058",
  },
});

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: "you are unauthorized" });
    }
    req.user = user;
    // console.log("req.hotelOwner...................", req.hotelOwner);
    next();
  } catch (err) {
    next(err);
  }
};

// create (Register)
exports.Register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, telephone, password } = req.body;
    // รอ hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      telephone,
      password: hashedPassword,
    });
    transporter.sendMail({
      to: user.email,
    });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

// create (Login)
exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    // console.log("user...........................", user);
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    // console.log(token);
    // let info = await transporter.sendMail({
    //   from: '"tryitfordevelop@gmail.com', // sender address
    //   // to: "tryitfordevelop@gmail.com, baz@example.com", // list of receivers
    //   to: email, // list of receivers
    //   subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: "<b>Hello world?</b>", // html body
    // });
    res.json({ message: "success login", token });
  } catch (err) {
    next(err);
  }
};

// create (Facebook Login......)
exports.facebookLogin = async (req, res, next) => {
  try {
    const { email, facebookId, firstName, lastName } = req.body;
    const user = await User.findOne({
      where: { email, facebookId, firstName, lastName },
    });
    console.log("user.....................", user);

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
      console.log("token.....................", token);
      res.json({ message: "success login", token });
    } else if (!user) {
      const user = await User.create({
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
      console.log("token.....................", token);
      // res.json({ message: "success login", token });
      res.json({ message: "success login", token });
      // const payload = {
      //   id: user.id,
      //   email: user.email,
      //   role: user.role,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   facebookId: user.facebookId,
      // };
    }
  } catch (err) {
    next(err);
  }
};

// create (forget password)
exports.resetPassword = async (req, res, next) => {
  // try {
  const { email } = req.body;
  // console.log("email.................", email);
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(object);
    }
    const token = buffer.toString("hex");
    // console.log("buffer......................", buffer);
    // console.log("token......................", token);
    User.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User does not exist with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: email,
          from: "tryitfordevelop@gmail.com",
          subject: "password reset", // Subject line
          text: "Hello world?", // plain text body
          // html: "<b>Hello world?</b>", // html body
          html: `
          <p>you requested for password reset</p>
          <h5>click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
          `,
        });
        res.json({ message: "check your email", token });
      });
    });
  });
  // } catch (err) {
  // next(err);
  // }
};

exports.newPassword = async (req, res, next) => {
  // const { email } = req.body;
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  console.log("sentToken............", sentToken);
  console.log("newPassword..........", newPassword);
  User.findOne({
    where: {
      resetToken: sentToken,
      expireToken: { [Op.gt]: Date.now() },
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again, session expired" });
      }

      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
