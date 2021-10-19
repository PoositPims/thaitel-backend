module.exports = (sequelize, DataTypes) => {
  const AssignRoom = sequelize.define(
    "AssignRoom",
    {
      checkInDate: {
        // เก็บเป็น date ?
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOutDate: {
        // เก็บเป็น date ?
        type: DataTypes.DATE,
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
