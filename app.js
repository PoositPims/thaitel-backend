require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const hotelOwnerRoute = require("./routes/hotelOwnerRoute");
const residentRoute = require("./routes/residentRoute");
const roomRoute = require("./routes/roomRoute");
const serviceItemRoute = require("./routes/serviceItemRoute");

// const { sequelize } = require("./models");
// sequelize.sync({ force: true }); // sync แล้วให้ comment เลย

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoute);
app.use("/hotelOwners", hotelOwnerRoute);
app.use("/residents", residentRoute);
app.use("/rooms", roomRoute);
app.use("/serviceItems", serviceItemRoute);

// เอาไว้ดักเวลาหาไม่เจอ
app.use((req, res, next) => {
  res.status(404).json({ messahe: "this resource is not found" });
});

// handle error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

app.listen(7777, () => console.log("server running in port 7777"));
