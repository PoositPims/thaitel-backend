module.exports = (sequelize, DataTypes) => {
  // owner admin ใช้เพื่อโอนเงินไปให้เจ้าของ
  const BankAccount = sequelize.define(
    "BankAccount",
    {
      bankName: {
        type: DataTypes.STRING,
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
        type: DataTypes.TEXT,
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
