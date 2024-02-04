import { Server, Socket } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send-changes", (delta) => {
    console.log(delta)
    socket.broadcast.emit("receive-changes", delta);
  });
});
