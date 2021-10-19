module.exports = (sequelize, DataTypes) => {
  const ResidentImg = sequelize.define(
    "ResidentImg",
    {
      ImgUrl: {
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
      ForeignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return ResidentImg;
};
