import { Sequelize } from "sequelize";

const sequelizeConnection = new Sequelize(
  process.env.SEQUELIZE_DATABASE,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    port: Number(process.env.SEQUELIZE_PORT),
    dialect: "postgres",
  }
);

export default sequelizeConnection;
