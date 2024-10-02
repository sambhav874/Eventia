const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("new-user-add", (email) => {
    if (!onlineUsers.some((user) => user.email === email)) {
      onlineUsers.push({ email, socketId: socket.id });
      console.log("New user is here!", onlineUsers);
    }
    io.emit("get-users", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("user disconnected", onlineUsers);
    io.emit("get-users", onlineUsers);
  });

  socket.on("offline", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("user is offline", onlineUsers);
    io.emit("get-users", onlineUsers);
  });
});

const PORT = process.env.SOCKET_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});

module.exports = { io };