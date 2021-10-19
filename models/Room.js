module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      typeOf: {
        // STRING หรือ ENUM ดีไหม
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomDetail: {
        // เก็บเป็น ENUM ดีไหม
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      OptionalRoomDetail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      noSmoking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      petAllowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      pricePerNight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imgURL: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      maxGuest: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  Room.associate = (models) => {
    Room.belongsTo(models.Resident, {
      ForeignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Room.hasMany(models.RoomNumber, {
      ForeignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Room.hasMany(models.BookingItem, {
      ForeignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Room;
};
