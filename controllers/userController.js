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

    //แพรลอง
    const checkUser = await User.findOne({ where: { email: email } });

    if (checkUser) {
      return res.status(400).json({ message: "email is already used" });
    }
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
      lastName: user.lastName,
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

// google login.................
exports.googleLogin = async (req, res, next) => {
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
          // <div style={{background-color:red}}>
          //   html: `
          //   <div style='background-color:#f5f5f5; font-family: "Noto Sans Thai",sans-serif;'>
          //   <div style='background-color:#07133C; '>
          //    <h1 style="font-family:'Noto Sans Thai' ,sans-serif ; color:white ; text-align:center ",  >THAITEL</h1>
          //  </div>

          //  <div style='display:flex;
          //              align-items: center;
          //      justify-content: center;'>
          //    <div style='background-color:white; width:80%;
          //              padding:1em;
          //              text-align:center;
          //              margin-top:20px;margin-bottom:20px;
          //              '>
          //  <p style=" display:flex;font-family:'Noto Sans Thai' ,sans-serif ";>สวัสดีคุณ ${user.firstName}</p>
          //  <p>ลืมรหัาผ่านใช่หรือไม่ ?</p>
          //  <p>ไม่ใช่ปัญหา คลิ๊กที่นี่เพื่อที่จะตั้งรหัสผ่านของคุณใหม่</p>

          //  <a href="http://localhost:3000/reset/${token}"
          //     style='background-color:#c62828; color:white;
          //                   border: none;

          //                   border-radius:5px;
          //                   box-shadow: 0 4px 20px 0 rgb(61 71 82 / 10%), 0 0 0 0 rgb(0 127 255 / 0%);
          //                   padding: 15px 32px;
          //                   width: 300px;
          //                   transition: all 200ms ease;

          //                   text-decoration:none !important;'  >

          //                   ตั้งรหัสผ่านใหม่

          //                   </a>
          //  </div>
          //    </div>

          //   <div style='display:flex;
          //              align-items: center;
          //      justify-content: center;'>
          //     <div  style='background-color:white; width:80%;
          //              padding:1em;
          //            ;

          //              '>

          //   <div style='display:flex;'>
          //  <p style='margin-right:20px; font-size: 30px;'>ติดต่อเรา</p>
          //  </div>

          //  <div style='display:flex;'>
          //  <p style='margin-right:20px;'>Email : </p>
          //  <p> Thaitel@gmail.com</p>
          //  </div>

          //  <div style='display:flex;'>
          //  <p style='margin-right:20px;'>Telephone : </p>
          //  <p> 02-2222222</p>
          //  </div>

          //   <div style='border-top: thick double #c62828;'>
          //  <p>มอบความสุขกับช่วงเวลาการพักผ่อนของคุณ</p>
          //  <p>เพื่อโรงแรมไทย เพื่อคนไทย เพื่อทุก ๆ คน</p>
          //  <h1 style="font-family:'Noto Sans Thai' ,sans-serif ; color:#07133C ;  ",  >THAITEL</h1>
          //  </div>
          //       </div>
          //      </div>
          //  </div>
          //   `,
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
                                        <a href="http://localhost:3000/reset/${token}"
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
