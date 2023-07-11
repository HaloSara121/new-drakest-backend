import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { router } from "./routes";
import "./database";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

const httpServer = createServer(app);

const io = new Server(httpServer);

export { httpServer, io };
