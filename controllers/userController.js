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
          html: `
          <div style='background-color:#f5f5f5;'>
          <div style='background-color:#07133C;'>
           <h1 style="font-family:'Noto Sans Thai' ,sans-serif ; color:white ; text-align:center ",  >THAITEL</h1>
         </div>
         
         <div style='display:flex;
                     align-items: center;
             justify-content: center;'>
           <div style='background-color:white; width:80%;  
                     padding:1em; 
                     text-align:center; 
                     margin-top:20px;margin-bottom:20px;  
                     '>
         <p style=" display:flex;font-family:'Noto Sans Thai' ,sans-serif ";>สวัสดีคุณ ${user.firstName}</p>
         <p>ลืมรหัาผ่านใช่หรือไม่ ?</p>
         <p>ไม่ใช่ปัญหา คลิ๊กที่นี่เพื่อที่จะตั้งรหัสผ่านของคุณใหม่</p>
         <a href="http://localhost:3000/reset/${token}" >
          <button style='background-color:#c62828; color:white; 
                          border: none;
                          cursor: pointer;
                          border-radius:5px;
                          box-shadow: 0 4px 20px 0 rgb(61 71 82 / 10%), 0 0 0 0 rgb(0 127 255 / 0%);
                          padding: 15px 32px;
                          width: 300px;
                          transition: all 200ms ease;
                          font-family: "Noto Sans Thai",sans-serif;
                          text-decoration:none;'>ตั้งรหัสผ่านใหม่</button></a>
         </div>  
           </div>
           
          <div style='display:flex;
                     align-items: center;
             justify-content: center;'>
            <div  style='background-color:white; width:80%;  
                     padding:1em; 
                   ; 
                     
                     '>
                
          <div style='display:flex;'>
         <p style='margin-right:20px; font-size: 30px;'>ติดต่อเรา</p>
         </div>
              
         <div style='display:flex;'>
         <p style='margin-right:20px;'>Email : </p>
         <p> Thaitel@gmail.com</p>
         </div>
              
         <div style='display:flex;'>
         <p style='margin-right:20px;'>Telephone : </p>
         <p> 02-2222222</p>
         </div>
         
          <div style='border-top: thick double #c62828;'>
         <p>มอบความสุขกับช่วงเวลาการพักผ่อนของคุณ</p>
         <p>เพื่อโรงแรมไทย เพื่อคนไทย เพื่อทุก ๆ คน</p>
         <h1 style="font-family:'Noto Sans Thai' ,sans-serif ; color:#07133C ;  ",  >THAITEL</h1>
         </div>
              </div>
             </div>
         </div>
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
