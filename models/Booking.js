module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      // name: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // typeOfRoom:{
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      checkInDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      checkOutDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      serviceFee: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("error", "pending", "success"),
        allowNull: false,
      },
      chillpayTransaction: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      underscored: true,
    }
  );
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Booking.hasMany(models.BookingItem, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Booking;
};
