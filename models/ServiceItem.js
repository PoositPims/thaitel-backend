module.exports = (Sequelize, DataTypes) => {
  const ServiceItem = Sequelize.define("ServiceItem", {
    underscored: true,
  });
  ServiceItem.associate = (models) => {
    ServiceItem.belongsTo(models.Resident, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    ServiceItem.belongsTo(models.Service, {
      foreignKey: {
        name: "serviceId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return ServiceItem;
};
