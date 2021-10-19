module.exports = (sequelize, DataTypes) => {
  const Resident = sequelize.define(
    "Resident",
    {
      typeOf: {
        // STRING หรือ ENUM ดีไหม
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rateStar: {
        // string หรือ ตัวเลข
        type: DataTypes.STRING,
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
      policy: {
        // จำเป็นต้องมีไหม ???
        // เก็บเป็น ENUM ดีไหม
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeCheckIn: {
        // เก็บเป็น Date ดีไหม
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeCheckOut: {
        // เก็บเป็น Date ดีไหม
        type: DataTypes.STRING,
        allowNull: false,
      },
      cancleDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
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
    Resident.hasMany(models.Service, {
      foreignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Resident.hasMany(models.Facility, {
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
