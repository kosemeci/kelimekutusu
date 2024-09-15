const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const userRoutes = require("./routes/users");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://kutukutukelime.com",
    methods: ["GET", "POST"]
  }
});

require('./socket')(io);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("node_modules")); 
app.use(express.json());
app.use(userRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});