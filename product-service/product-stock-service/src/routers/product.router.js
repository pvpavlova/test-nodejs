const router = require("express").Router();
const { Product } = require("../../db/models");

router.post("/", async (req, res) => {
  try {
    const { plu, name } = req.body;
    const product = await Product.create({ plu, name });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании товара", error });
  }
});

router.get("/product", async (req, res) => {
  try {
    const { name, plu } = req.query;
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (plu) where.plu = plu;

    const products = await Product.findAll({ where });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении товаров", error });
  }
});


module.exports = router;
