"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
require("./database");
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use(routes_1.router);
const httpServer = (0, http_1.createServer)(server);
exports.io = new socket_io_1.Server(httpServer);
httpServer.listen(3333, () => console.log("Server is running!"));
