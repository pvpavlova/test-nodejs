import { Request, Response } from "express";
import { HistoryService } from "../services/history.service";

class HistoryController {
  static async getHistory(req: Request, res: Response): Promise<void> {
    const {
      shop_id,
      plu,
      date_from,
      date_to,
      action,
      page = 1,
      limit = 10,
    } = req.query;

    if (page && isNaN(Number(page))) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    if (limit && isNaN(Number(limit))) {
      return res.status(400).json({ message: "Invalid limit number" });
    }

    const isValidDate = (date: string) => !isNaN(Date.parse(date));
    if (date_from && !isValidDate(date_from as string)) {
      return res.status(400).json({ message: "Invalid date_from format" });
    }

    if (date_to && !isValidDate(date_to as string)) {
      return res.status(400).json({ message: "Invalid date_to format" });
    }

    try {
      const history = await HistoryService.getFilteredHistory({
        shop_id: shop_id as string,
        plu: plu as string,
        date_from: date_from as string,
        date_to: date_to as string,
        action: action as string,
        page: Number(page),
        limit: Number(limit),
      });
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении истории", error });
    }
  }
}

export { HistoryController };
