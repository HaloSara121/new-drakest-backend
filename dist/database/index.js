"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelizeConnection = new sequelize_1.Sequelize('drakest', 'postgres', '0312456', {
    host: '129.148.47.116',
    dialect: 'postgres'
});
exports.default = sequelizeConnection;
