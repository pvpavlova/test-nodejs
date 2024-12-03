import { Op } from "sequelize";
import ActionLog from "../models/history.model";

interface IHistoryFilter {
  shop_id?: string;
  plu?: string;
  date_from?: string;
  date_to?: string;
  action?: string;
  page: number;
  limit: number;
}

class HistoryService {
  static async getFilteredHistory({
    shop_id,
    plu,
    date_from,
    date_to,
    action,
    page,
    limit,
  }: IHistoryFilter) {
    const where: any = {};

    if (shop_id) where.shop_id = shop_id;
    if (plu) where.plu = plu;
    if (date_from && date_to) {
      where.date = {
        [Op.between]: [new Date(date_from), new Date(date_to)],
      };
    } else if (date_from) {
      where.date = { [Op.gte]: new Date(date_from) };
    } else if (date_to) {
      where.date = { [Op.lte]: new Date(date_to) };
    }
    if (action) where.action = action;

    const { count, rows } = await ActionLog.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit,
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows,
    };
  }
}

export { HistoryService };
