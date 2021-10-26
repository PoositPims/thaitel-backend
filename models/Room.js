module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      typeOf: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomDetail: {
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
      optionalRoomDetail: {
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
        // allowNull: false,
        allowNull: true,
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
    Room.hasMany(models.BookedDaily, {
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
