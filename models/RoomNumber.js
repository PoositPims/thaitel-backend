module.exports = (sequelzie, DataTypes) => {
  const RoomNumber = sequelzie.define(
    "RoomNumber",
    {
      roomNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      underscored: true,
    }
  );
  RoomNumber.associate = (models) => {
    RoomNumber.belongsTo(models.Room, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    RoomNumber.hasMany(models.AssignRoom, {
      foreignKey: {
        name: "roomNumberId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return RoomNumber;
};
