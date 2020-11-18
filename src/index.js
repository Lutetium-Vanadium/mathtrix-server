const app = require("express")();

const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origins: "*:*" } });

const PORT = process.env["PORT"] || 5000;

let blobs = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("init-blobs", blobs);

  socket.on("join", (evtName, direction) => {
    blobs[socket.id] = { evtName, direction };

    console.log(blobs);

    io.emit("join", socket.id, evtName, direction);
  });

  socket.on("update:evt", (evtName) => {
    if (blobs[socket.id]) {
      blobs[socket.id].evtName = evtName;
      io.emit("update:evt", socket.id, evtName);
    }
  });

  socket.on("disconnect", () => {
    delete blobs[socket.id];
    io.emit("leave", socket.id);
    console.log("a user has disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
