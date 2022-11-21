import "reflect-metadata"
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { router } from "./router";

import "./database";

const server = express();

server.use(express.json())
server.use(router)

const httpServer = createServer(server);

export const io = new Server(httpServer);

httpServer.listen(3333, () => console.log("Server is running!"));