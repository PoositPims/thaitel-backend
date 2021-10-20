module.exports = (sequelize, DataTypes) => {
  const AssignRoom = sequelize.define(
    "AssignRoom",
    {
      checkInDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      checkOutDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  AssignRoom.associate = (models) => {
    AssignRoom.belongsTo(models.RoomNumber, {
      foreignKey: {
        name: "roomNumberId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    AssignRoom.belongsTo(models.BookingItem, {
      foreignKey: {
        name: "bookingItemId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return AssignRoom;
};
