const router = require("express").Router();
const productRouter = require("./product.router");
const stockRouter = require("./stock.router");
const { Shop } = require("../../db/models");
router.use("/product", productRouter);
router.use("/stock", stockRouter);

router.post("/shop", async (req, res) => {
  try {
    const { name, location } = req.body;
    const shop = await Shop.create({ name, location });
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании магазина", error });
  }
});
module.exports = router;
