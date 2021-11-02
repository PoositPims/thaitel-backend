const { User } = require("../models");


exports.Google = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // const user = await User.findOne({ where: { email: email } });
      // รอ hash password
    //   const hashedPassword = await bcrypt.hash(password, 12);
    //   const user = await User.create({
    //     firstName,
    //     lastName,
    //     email,
    //     telephone,
    //     password: hashedPassword,
    //   });
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  };