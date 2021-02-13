const env = require("../config/env");
const mqtt = require("mqtt");

let url = `${env.mqtt.protocol}://${env.mqtt.host}${
  env.mqtt.port ? ":" + env.mqtt.port : ""
}${env.mqtt.url ? "/" + env.mqtt.url : ""}`;

const client = mqtt.connect(url);

module.exports = client;
