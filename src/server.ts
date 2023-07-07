import { httpServer } from "./http";
import "./websocket";

httpServer.listen(3333, () => console.log("Server is running!"));
