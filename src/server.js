const server = require("./config/server");
const router = require("./routes");
const socketIo = require('socket.io');
const logger = require("morgan");
const io = socketIo.listen(server.server);

server.use((req, res, next) => {
  // socket
  req.io = io;
  return next();
});

server.use(logger("dev"));

// routers
router.applyRoutes(server);

server.get("/helth", (req, res, next) => {
  return res.send(200, { data: "OK" });
});

// hello
server.get("/", (req, res, next) => {
  res.header('Content-Type', 'text/html')
  return res.end("<h1>This is a REST API</h1>");
});

server.on("error", (error) => {
  console.error(error);
});

server.on("listening", (data) => {
  console.info(
    `Server ${server.name} is run in ${server.address().family}${server.address().address}${server.address().port}`
  );
});
module.exports = server;
