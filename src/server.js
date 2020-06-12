const server = require("./config/server");
const router = require("./routes");
const socketIo = require('socket.io');
const logger = require("morgan");
const mqtt = require('./services/mqtt-service');
const mqttHandler = require('./controller/mqtt');
const io = socketIo.listen(server.server);

// socket
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


mqtt.on("connect", (data) => {
  console.info(`connected sucessful in mqtt broker at ${url}`);
  console.log(data)
  mqtt.subscribe("server", (err) => {

    if (err) {
      console.error(err);
      mqtt.end();
    }
  });
  mqtt.subscribe("server2", (err) => {

    if (err) {
      console.error(err);
      mqtt.end();
    }
  });
});

mqtt.on("message", async (topic, data, packet) => {
  // message is Buffer
  console.info(Date());
  let payload = data.toString();
  console.log(`[${topic}]`, payload, packet);
  try {
    const payload = JSON.parse(data.toString());
    mqttHandler(payload);
  } catch (error) {
    console.error(error);
  }
});


server.on("error", (error) => {
  console.info(error);
});

server.on("listening", (data) => {
  console.info(
    `Server is run in ${server.address().address}${server.address().port}`
  );
});
module.exports = server;
