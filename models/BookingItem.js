// รายละเอียดการจอง
module.exports = (sequelize, DataTypes) => {
  const BookingItem = sequelize.define(
    "BookingItem",
    {
      roomBookingAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  BookingItem.associate = (models) => {
    BookingItem.belongsTo(models.Room, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    BookingItem.belongsTo(models.Booking, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    BookingItem.hasMany(models.AssignRoom, {
      foreignKey: {
        name: "bookingItemId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return BookingItem;
};
