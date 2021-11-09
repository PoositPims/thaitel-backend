// // เอา booking id มาแทน order และ cartid ใน line 33 (old project)

const axios = require("axios");
const CryptoJs = require("crypto-js");
// const { Order, Cart } = require("../models");
const { Booking, BookingItem } = require("../models");

const chillpayUrl = "https://sandbox-appsrv2.chillpay.co/api/v2/Payment/";
const merchantCode = "M032803";
const apiKey =
  "i97Mhcsj6gxB4sqqEGUDJLmbZcPeiKpGDRCkyMVenN2ccmSUHNHHw0iAVJQo8o2P";
const md5Secret =
  "QJiKwtT8Ap0ILD7VqAQQVnk9abcqPHhnLT9NSSpq8tq4YBjwfYsAerrqqMr2o2vQUcc6hXc124wHuWzoOI4DiSSTTbJa554uy4tmd4AY1A0FUb5CzPAfbgFKhzGpo2ix4s5TqY5amGkY6r3KYpeB4xED6Uc96woztVYHn";

const redirectPath = "http://localhost:3000/";

//create
exports.createPaymentReq = async (req, res, next) => {
  try {
    //............................................................................
    const {
      userId,
      checkInDate,
      checkOutDate,
      totalPrice,
      serviceFee,
      rooms,
      // respCode,
      // status,
    } = req.body;

    // console.log("respCode......................", respCode);

    // // update order status
    // let status;
    // if (respCode === 3) {
    //   status = "error";
    // } else if (respCode === 9) {
    //   status = "pending";
    // } else {
    //   status = "success";
    // }

    const booking = await Booking.create({
      checkInDate,
      checkOutDate,
      totalPrice,
      serviceFee,
      status: "pending",
      userId,
    });
    // console.log("respCode.....................", respCode);
    // rooms :[{roomId:1, roomBookingAmount:1},{roomId:2, roomBookingAmount:2}]
    const bookingItems = rooms.map((item) => {
      return {
        roomId: item.roomId,
        roomBookingAmount: item.roomBookingAmount,
        bookingId: booking.id,
      };
    });

    await BookingItem.bulkCreate(bookingItems);
    //............................................................................

    // const { userId, bookingId } = req.body;
    // const booking = await Booking.findByPk(bookingId);

    // ศึกษารอลบ
    // if (!booking) {
    //   throw new Error("no booking");
    // }
    // if (booking.status.paid) {
    //   throw new Error("this booking is already paid");
    // }
    const IPAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // const transaction = await Transaction.create({
    //   bookingId: req.bookingId,
    //   status: "pending",
    //   transactionId: TransactionId.toString(),
    //   // cartId,.user.id,
    // });

    // const orderNo = booking.id;
    const orderNo = booking.id;
    const amount = booking.totalPrice * 100 + booking.serviceFee * 100;
    const phoneNumber = "081111111";
    const description = "test buy";
    const channelCode = "creditcard";

    const requestBody = {
      MerchantCode: merchantCode,
      OrderNo: orderNo,
      CustomerId: userId,
      Amount: amount,
      PhoneNumber: phoneNumber,
      Description: description,
      ChannelCode: channelCode,
      Currency: "764",
      LangCode: "TH",
      RouteNo: "1",
      IPAddress,
      ApiKey: apiKey,
      TokenFlag: "N",
      Md5Secret: md5Secret,
    };

    // make all value in the object to array
    const bodyValues = Object.values(requestBody);

    // stringify from bodyValues
    const stringBodyValues = bodyValues.reduce((prev, key) => prev + key, "");

    const CheckSum = CryptoJs.MD5(stringBodyValues).toString();

    // contact chillpay
    const { data } = await axios.post(
      chillpayUrl,
      {
        ...requestBody,
        CheckSum,
      },
      {
        timeout: 30000,
      }
    );
    const { TransactionId } = data;
    // await booking.update({ transactionId: TransactionId.toString() });
    // const transaction = await Transaction.create({
    //   bookingId: req.bookingId,
    //   status: "pending",
    //   transactionId: TransactionId.toString(),
    //   // cartId,.user.id,
    // });
    await booking.update({ chillpayTransaction: TransactionId.toString() });
    res.status(201).json({ ChillpayData: data });
    // console.log("data.................................", data);
  } catch (err) {
    next(err);
  }
};

exports.paymentResult = async (req, res, next) => {
  try {
    const { status, transNo, respCode } = req.body;
    // const booking = await Booking.findOne({
    //   where: {
    //     id: id,
    //     // transactionId: transNo.toString(),
    //   },
    // });
    // console.log(object)
    // console.log("transNo....................................", transNo);
    // console.log("respCode....................................", respCode);
    const booking = await Booking.findOne({
      where: {
        // transactionId: transNo.toString(),
        chillpayTransaction: transNo.toString(),
      },
    });

    // // update order status
    if (respCode > 0) {
      await booking.update({ status: "cancle" });
    } else {
      await booking.update({ status: "success" });

      // const booking = await Booking.findByPk(data.OrderNo + "");
      if (!booking) {
        throw new Error("no booking");
      }
      // booking.chillpayTransaction = TransactionId;
      booking.status = "success";
      await booking.save();
    }
  } catch (err) {
    next(err);
  }
  res.redirect(redirectPath);
};

// // const idx = cartItems.findIndex((x) => x.id === product.id);
// //     const newCart = [...cartItems];
// //     if (idx > -1) {
// //       newCart[idx] = { ...newCart[idx], qty: newCart[idx].qty + 1 };
// //     } else {
// //       newCart.push({ ...product, qty: 1 });
// //     }
// //     setCartItems(newCart);
