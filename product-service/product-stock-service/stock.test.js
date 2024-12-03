const request = require("supertest");
const app = require("./src/app");
const { sequelize, Product, Shop, Stock } = require("./db/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("API тестирование", () => {
  let product, shop, stock;

  beforeAll(async () => {
    product = await Product.create({ plu: "1234", name: "Товар 1" });
    shop = await Shop.create({ name: "Магазин 1" });
    stock = await Stock.create({
      product_id: 1,
      shop_id: 1,
      quantity_on_shelf: 100,
      quantity_in_order: 50,
    });
  });

  it("Создание товара", async () => {
    const response = await request(app)
      .post("/api/v1/product")
      .send({ plu: "5678", name: "Товар 2" });

    expect(response.status).toBe(201);
    expect(response.body.plu).toBe("5678");
    expect(response.body.name).toBe("Товар 2");
  });

  it("Создание магазина", async () => {
    const response = await request(app)
      .post("/api/v1/shop")
      .send({ name: "Магазин 2" });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Магазин 2");
  });

  it("Создание остатка товара", async () => {
    const response = await request(app).post("/api/v1/stock").send({
      product_id: product.id,
      shop_id: shop.id,
      quantity_on_shelf: 100,
      quantity_in_order: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body.quantity_on_shelf).toBe(100);
    expect(response.body.quantity_in_order).toBe(10);
  });

  it("Получение остатков по фильтрам", async () => {
    const response = await request(app)
      .get("/api/v1/stock")
      .query({ shop_id: shop.id, plu: "1234" });

    console.log("Response Body:", response.body); 

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Увеличение остатка товара", async () => {
    const stock = await Stock.create({
      product_id: product.id,
      shop_id: shop.id,
      quantity_on_shelf: 100,
      quantity_in_order: 10,
    });

    const response = await request(app)
      .put(`/api/v1/stock/increase/${stock.id}`)
      .send({
        quantity_on_shelf: 50,
        quantity_in_order: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.quantity_on_shelf).toBe(150);
    expect(response.body.quantity_in_order).toBe(15);
  });

  it("Уменьшение остатка товара", async () => {
    const stock = await Stock.create({
      product_id: product.id,
      shop_id: shop.id,
      quantity_on_shelf: 150,
      quantity_in_order: 15,
    });

    const response = await request(app)
      .put(`/api/v1/stock/decrease/${stock.id}`)
      .send({
        quantity_on_shelf: 30,
        quantity_in_order: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.quantity_on_shelf).toBe(120);
    expect(response.body.quantity_in_order).toBe(10);
  });
});
