const { HotelOwner } = require("../models");
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

exports.ownerGoogleLogin = async (req, res, next) => {
  try {
    const { email, firstName, lastName, googleId } = req.body;
    // console.log('148')
    const user = await HotelOwner.findOne({ where: { email, googleId } });
    // console.log('149')
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
      const userCreate = await HotelOwner.create({
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
    HotelOwner.findOne({ where: { email: email } }).then((user) => {
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
          html: `
          <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <!-- <td style="text-align:center;">
                          <a href="https://rakeshmandal.com" title="logo" target="_blank">
                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                          </a>
                        </td> -->
                        <div style='background-color:#07133C; '>
           <h1 style="font-family:'Noto Sans Thai' ,sans-serif ; color:white ; text-align:center ",  >THAITEL</h1>
         </div>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                           <!-- You have requested to reset your password -->
                                          คุณได้ร้องขอที่จะเปลี่ยนรหัสผ่านใหม่
                                      </h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <!-- <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p> -->
                                      <p style=" display:flex;font-family:'Noto Sans Thai' ,sans-serif ";>สวัสดีคุณ ${user.firstName}</p>
         <p style="display:flex;">ลืมรหัสผ่านใช่หรือไม่ ?</p>
         <p style="display:flex;">ไม่ใช่ปัญหา คลิ๊กที่นี่เพื่อที่จะตั้งรหัสผ่านของคุณใหม่</p>
                                        <a href="http://localhost:3000/resetOwner/${token}"
                                            style="background:#c62828;text-decoration:none !important; font-weight:500; margin-top:35px; 
                                                   color:#fff;text-transform:uppercase; 
                                                   font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                          ตั้งรหัสผ่านใหม่</a>
       
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>THAITEL</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>
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
  // console.log("sentToken............", sentToken);
  // console.log("newPassword..........", newPassword);
  HotelOwner.findOne({
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
