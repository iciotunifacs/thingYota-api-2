import server, { Request, Response, Next } from "./config/server";
import router from "./routes/index";
const socketIo = require("socket.io");
const logger = require("morgan");
const mqtt = require("./services/mqtt-service");
const mqttHandler = require("./controller/mqtt");
const io = socketIo.listen(server.server);
const env = require("./config/env");

interface CustonRequest extends Request {
  io: any;
}

// server.use((req: CustonRequest, res: Response, next: Next) => {
//   // socket
//   req.io = io;
//   return next();
// });

// server.use(logger("dev"));

// routers
// router.applyRoutes(server);
server.applyRoutes(router);

server.get("/helth", (req, res, next) => {
  return res.send(200, { data: "OK" });
});

// hello
server.get("/", (req, res, next) => {
  res.header("Content-Type", "text/html");
  return res.end("<h1>This is a REST API</h1>");
});

// mqtt.on("connect", (data: any, err: Error) => {
//   console.info(`connected sucessful in mqtt broker `);
//   mqtt.subscribe(env.mqtt.server_broker, (err: Error) => {
//     if (err) {
//       console.error(err);
//       mqtt.end();
//     }
//   });
// });

// mqtt.on("message", async (topic: string, data: any, packet: any) => {
//   // message is Buffer
//   console.info(Date());
//   let payload = data.toString();
//   console.log(`[${topic}]`, payload.toString());
//   try {
//     const payload = JSON.parse(data.toString());
//     mqttHandler(payload, io);
//   } catch (error) {
//     console.error(error);
//   }
// });

server.on("error", (error: Error) => {
  console.info(error);
});

server.on("listening", () => {
  console.info(
    `Server ${server.name} is run in ${server.address().family}${
      server.address().address
    }${server.address().port}`
  );
});
module.exports = server;