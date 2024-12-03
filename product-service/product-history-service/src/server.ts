import express, { Request, Response } from "express";
import sequelize from "./database";
import ActionLog from "./models/history.model";

const app = express();
const port = 3001;

app.use(express.json());


sequelize
  .sync({ force: true })
  .then(() => {
    console.log("History database synchronized!");
  })
  .catch((err) => {
    console.error("Error during synchronization:", err);
  });


app.post("/logs", async (req: Request, res: Response) => {
  const { shop_id, plu, action, date } = req.body;

  try {
    const log = await ActionLog.create({ shop_id, plu, action, date });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


app.get("/logs", async (req: Request, res: Response) => {
  const {
    shop_id,
    plu,
    action,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const where: any = {};

    if (shop_id) where.shop_id = shop_id;
    if (plu) where.plu = plu;
    if (action) where.action = action;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date["$gte"] = new Date(startDate as string);
      if (endDate) where.date["$lte"] = new Date(endDate as string);
    }

    const offset = (Number(page) - 1) * Number(limit);

    const logs = await ActionLog.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [["date", "DESC"]],
    });

    res.json({
      total: logs.count,
      pages: Math.ceil(logs.count / Number(limit)),
      data: logs.rows,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(port, () => {
  console.log(`History service running on http://localhost:${port}`);
});

export default app;
