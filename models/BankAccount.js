module.exports = (sequelize, DataTypes) => {
  // owner admin ใช้เพื่อโอนเงินไปให้เจ้าของ
  const BankAccount = sequelize.define(
    "BankAccount",
    {
      bankName: {
        // type: DataTypes.STRING,
        type: DataTypes.ENUM(
          "Bank of Ayudhya",
          "Kasikorn bank",
          "Krungthai bank",
          "Siam Commercial Bank",
          "Aomsin bank"
        ),
        allowNull: false,
      },
      AccountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      AccountName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageIdURL: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  BankAccount.associate = (models) => {
    BankAccount.belongsTo(models.Resident, {
      ForeignKey: {
        name: "residentId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return BankAccount;
};
