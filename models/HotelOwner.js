module.exports = (sequelize, DataTypes) => {
  const HotelOwner = sequelize.define(
    "HotelOwner",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idCard: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idCardImage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  HotelOwner.associate = (models) => {
    HotelOwner.hasMany(models.Resident, {
      foreignKey: {
        name: "hotelOwnerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return HotelOwner;
};
