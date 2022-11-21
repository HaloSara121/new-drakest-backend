import { Sequelize } from "sequelize";

const sequelizeConnection = new Sequelize('drakest', 'postgres', '0312456', {
  host: '129.148.47.116',
  dialect: 'postgres' 
});

export default sequelizeConnection