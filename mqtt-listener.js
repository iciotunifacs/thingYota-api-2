
const {workerData, parentPort} = require('worker_threads')
const mqtt = require('./src/services/mqtt-service');
const mqttHandler = require('./src/controller/mqtt');
const env = require('./src/config/env');

mqtt.on("connect", (data,err) => {
  console.info(`connected sucessful in mqtt broker `);
  mqtt.subscribe(env.mqtt.server_broker, (err) => {
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
  console.log(`[${topic}]`, payload.toString());
  try {
    const payload = JSON.parse(data.toString());
    mqttHandler(payload, workerData?.io);
  } catch (error) {
    console.error(error);
  }
});
