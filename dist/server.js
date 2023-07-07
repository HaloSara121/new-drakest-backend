"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
require("./websocket");
http_1.httpServer.listen(3333, () => console.log("Server is running!"));
