import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

class ActionLog extends Model {
  public id!: number;
  public shopId!: number;
  public plu!: string;
  public action!: string;
  public date!: Date;
}

ActionLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ActionLog",
    tableName: "action_logs",
  }
);

export default ActionLog;
