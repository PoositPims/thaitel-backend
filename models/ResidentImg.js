module.exports = (sequelize, DataTypes) => {
  const ResidentImg = sequelize.define(
    "ResidentImg",
    {
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  ResidentImg.associate = (models) => {
    ResidentImg.belongsTo(models.Resident, {
      foreingeKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return ResidentImg;
};
