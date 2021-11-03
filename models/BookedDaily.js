module.exports = (sequelize, DataTypes) => {
  const BookedDaily = sequelize.define(
    "BookedDaily",
    {
      roomRemaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      // tableName: "booked_dailies",
      underscored: true,
    }
  );

  BookedDaily.associate = (models) => {
    BookedDaily.belongsTo(models.Room),
      {
        foreignKey: {
          name: "roomId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      };
  };
  return BookedDaily;
};
