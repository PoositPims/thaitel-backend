module.exports = (sequelize, DataTypes) => {
  const BookedDailay = sequelize.define("BookedDaily", {
    roomRemaining: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BookedRoom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  BookedDailay.associate = (models) => {
    BookedDailay.belongsTo(models.Room),
      {
        foreignKey: {
          name: "roomId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      };
  };
  return BookedDailay;
};