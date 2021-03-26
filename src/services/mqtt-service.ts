import env from "../config/env";
import mqtt from "mqtt";

let url = `${env.mqtt.protocol}://${env.mqtt.host}${
	env.mqtt.port ? ":" + env.mqtt.port : ""
}${env.mqtt.url ? "/" + env.mqtt.url : ""}`;

const client = mqtt.connect(url);

export default client;
