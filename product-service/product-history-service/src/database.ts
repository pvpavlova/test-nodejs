import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:111992@localhost:5432/history-service",
  {
    dialect: "postgres",
  }
);

export default sequelize;
