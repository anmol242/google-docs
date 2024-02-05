import { Server } from "socket.io";
import mongoose from "mongoose";
import Doc from "./models/Document";

mongoose.connect("mongodb://localhost/google-docs");

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const doc = await findOrCreateDoc(documentId);
    socket.join(documentId);

    socket.emit("load-document", doc.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data: Object) => {
      const x = await Doc.findByIdAndUpdate(documentId, { data });
    });
  });
});

const defaultDocValue = "";

const findOrCreateDoc = async (id: string) => {
  const document = await Doc.findById(id);
  if (document) {
    return document;
  }

  return Doc.create({ _id: id, data: defaultDocValue });
};
