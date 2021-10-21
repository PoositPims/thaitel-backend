module.exports = (sequelize, DataTypes) => {
  const FacilityItem = sequelize.define(
    "FacilityItem",
    {},
    {
      underscored: true,
    }
  );
  FacilityItem.associate = (models) => {
    FacilityItem.belongsTo(models.Resident, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    FacilityItem.belongsTo(models.Facility, {
      foreignKey: {
        name: "facilityId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return FacilityItem;
};
