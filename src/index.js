const app = require("express")();

const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origins: "*:*" } });

const PORT = process.env["PORT"] || 5000;

let blobs = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("test", "hello world");

  socket.on("join", (x, y, evtName) => {
    blobs[socket.id] = new Blob(x, y, evtName);
  });

  socket.on("update:evt", (evtName) => {
    blobs[socket.id].evtName = evtName;
  });

  socket.on("update:pos", (x, y) => {
    blobs[socket.id].setPos(x, y);
  });

  socket.on("disconnect", () => {
    delete blobs[socket.id];
    console.log("a user has disconnected");
  });
});

setInterval(() => {
  io.emit("update", Object.values(blobs));
}, 20);

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

class Blob {
  constructor(x, y, evtName) {
    this.x = x;
    this.y = y;
    this.evtName = evtName;
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
  }
}
