"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Shop, { foreignKey: "position_id" });
      Stock.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  Stock.init(
    {
      quantity_on_shelf: DataTypes.INTEGER,
      quantity_in_order: DataTypes.INTEGER,
      shop_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );
  return Stock;
};
