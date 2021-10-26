module.exports = (Sequelize, DataTypes) => {
  const ServiceItem = Sequelize.define(
    "ServiceItem",
    {
      serviceName: {
        type: DataTypes.ENUM(
          "parking",
          "breakFast",
          "wifi",
          "swimingPool",
          "bar",
          "sauna",
          "reception",
          "roomService",
          "fitnessRoom"
        ),
        allowNull: true,
      },
      isFree: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      pricePerTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  ServiceItem.associate = (models) => {
    ServiceItem.belongsTo(models.Resident, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    // ServiceItem.belongsTo(models.Service, {
    //   foreignKey: {
    //     name: "serviceId",
    //     allowNull: false,
    //   },
    //   onDelete: "RESTRICT",
    //   onUpdate: "RESTRICT",
    // });
  };
  return ServiceItem;
};
