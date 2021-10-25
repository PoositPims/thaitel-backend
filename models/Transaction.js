module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // status: {
      //   type: DataTypes.ENUM("cancle", "pending", "paid"),
      //   allowNull: false,
      // },
    },
    {
      underscored: true,
    }
  );
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Booking, {
      foreignKey: {
        name: "bookingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Transaction;
};
