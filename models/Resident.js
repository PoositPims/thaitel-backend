module.exports = (sequelize, DataTypes) => {
  const Resident = sequelize.define(
    "Resident",
    {
      typeOf: {
        type: DataTypes.ENUM("HOTEL", "APARTMENT", "VILLA"),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rateStar: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeCheckInStart: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeCheckInEnd: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeCheckOutStart: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeCheckOutEnd: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      canCancle: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // imgURL: {
      //   type: DataTypes.TEXT,
      //   // allowNull: false,
      //   allowNull: true,
      // },
    },
    {
      underscored: true,
    }
  );
  Resident.associate = (models) => {
    Resident.belongsTo(models.HotelOwner, {
      foreignKey: {
        name: "hotelOwnerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Resident.hasMany(models.ServiceItem, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Resident.hasMany(models.FacilityItem, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Resident.hasMany(models.Room, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Resident.hasOne(models.BankAccount, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Resident.hasMany(models.ResidentImg, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Resident;
};
