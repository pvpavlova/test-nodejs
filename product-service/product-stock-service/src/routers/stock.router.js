const router = require("express").Router();
const { Stock, Product, Shop } = require("../../db/models");
const { Op } = require("sequelize");
const logAction = require("../logAction");

router.post("/", async (req, res) => {
  try {
    const { product_id, quantity_on_shelf, quantity_in_order, shop_id } =
      req.body;
    const stock = await Stock.create({
      product_id,
      quantity_on_shelf,
      quantity_in_order,
      shop_id,
    });
    const product = await Product.findByPk(product_id);

    if (product) {
      await logAction(shop_id, product.plu, "STOCK_CREATED", new Date());
    }
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании остатка", error });
  }
});

router.put("/increase/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_on_shelf, quantity_in_order } = req.body;
    const stock = await Stock.findByPk(id);
    if (!stock) return res.status(404).json({ message: "Остатков нет" });
    const product = await Product.findByPk(stock.product_id);
    stock.quantity_on_shelf += quantity_on_shelf || 0;
    stock.quantity_in_order += quantity_in_order || 0;
    await stock.save();
    if (product) {
      await logAction(
        stock.shop_id,
        product.plu,
        "STOCK_INCREASED",
        new Date()
      );
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при увеличении остатка", error });
  }
});

router.put("/decrease/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_on_shelf, quantity_in_order } = req.body;
    const stock = await Stock.findByPk(id);

    if (!stock) return res.status(404).json({ message: "Остатков нет" });
    const product = await Product.findByPk(stock.product_id);
    stock.quantity_on_shelf -= quantity_on_shelf || 0;
    stock.quantity_in_order -= quantity_in_order || 0;
    await stock.save();

    if (product) {
      await logAction(
        stock.shop_id,
        product.plu,
        "STOCK_DECREASED",
        new Date()
      );
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при уменьшении остатка", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      plu,
      shop_id,
      quantity_on_shelf_min,
      quantity_on_shelf_max,
      quantity_in_order_min,
      quantity_in_order_max,
    } = req.query;

    const where = {};

    if (plu) where["$Product.plu$"] = plu;
    if (shop_id) where.shop_id = shop_id;

    if (quantity_on_shelf_min && quantity_on_shelf_max) {
      where.quantity_on_shelf = {
        [Op.gte]: quantity_on_shelf_min,
        [Op.lte]: quantity_on_shelf_max,
      };
    } else {
      if (quantity_on_shelf_min)
        where.quantity_on_shelf = { [Op.gte]: quantity_on_shelf_min };
      if (quantity_on_shelf_max)
        where.quantity_on_shelf = { [Op.lte]: quantity_on_shelf_max };
    }

    if (quantity_in_order_min && quantity_in_order_max) {
      where.quantity_in_order = {
        [Op.gte]: quantity_in_order_min,
        [Op.lte]: quantity_in_order_max,
      };
    } else {
      if (quantity_in_order_min)
        where.quantity_in_order = { [Op.gte]: quantity_in_order_min };
      if (quantity_in_order_max)
        where.quantity_in_order = { [Op.lte]: quantity_in_order_max };
    }

    const stocks = await Stock.findAll({
      where,
      include: [Product, Shop],
    });

    if (stocks.length === 0) {
      return res
        .status(404)
        .json({ message: "Нет остатков по заданным фильтрам" });
    }

    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({
      message: "Ошибка при получении остатков",
      error: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
