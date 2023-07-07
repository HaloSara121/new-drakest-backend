import { io } from "./http";

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} has been connected`);

  socket.on("entrei", (data) => {
    console.log(data);
  });
});
