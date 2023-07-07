import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import "reflect-metadata";

dotenv.config({ path: "../.env" });

import { router } from "./routes";

import "./database";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

const httpServer = createServer(app);

const io = new Server(httpServer);

export { httpServer, io };
