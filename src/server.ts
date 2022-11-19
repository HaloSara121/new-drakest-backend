import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { router } from "./router";

const server = express();

server.use(router)

const httpServer = createServer(server);

export const io = new Server(httpServer);



httpServer.listen(3333, () => console.log("Server is running!"));