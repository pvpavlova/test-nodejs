import request from "supertest";
import app from "./src/server";
import sequelize from "./src/database"; 
import ActionLog from "./src/models/history.model";

describe("History Service API", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await ActionLog.create({
      shop_id: 1,
      plu: "1234",
      action: "added",
      date: new Date().toISOString(),
    });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it("Создание записи об изменении", async () => {
    const response = await request(app).post("/api/v1/history").send({
      shop_id: 1,
      plu: "5678",
      action: "removed",
      date: new Date().toISOString(),
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Получение истории по фильтрам", async () => {
    const response = await request(app).get("/api/v1/history").query({
      shop_id: 1,
      plu: "1234",
      date_from: "2023-01-01",
      date_to: "2023-12-31",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.pagination).toHaveProperty("total");
  });
});
