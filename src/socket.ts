import { io } from "./server"

io.on("connection", (socket) => {
  console.log(`user ${socket.id} has connected`)
});