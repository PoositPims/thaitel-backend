module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define(
    "Facility",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isHaving: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  Facility.associate = (models) => {
    Facility.hasMany(models.FacilityItem, {
      foreignKey: {
        name: "facilityId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Facility;
};
