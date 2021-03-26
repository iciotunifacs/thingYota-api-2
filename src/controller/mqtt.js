const deviceHandler = require("../helpers/mqtt/device");
const semsorHandler = require("../helpers/mqtt/sensor");
const actorHandler = require("../helpers/mqtt/actor");
const { mqttCreate } = require("../controller/history");

const Device = require("../core/model/device");

module.exports = async (payload, socket) => {
	let data, from;
	switch (payload.to) {
		case "Device":
			data = await deviceHandler(payload, socket);
			if (data) {
				const historyCreate = {
					from: {
						type: "Device",
						_id: data._id,
					},
					to: {
						type: "Device",
						_id: data._id,
					},
					data: {
						event: payload.event,
						value: data.value ? data.value : true,
					},
				};
				mqttCreate(historyCreate);
			}
			break;
		case "Sensor":
			data = await semsorHandler(payload, socket);
			if (data) {
				from = await Device.findOne({
					mac_addres: payload.mac_addres,
				});
				const historyCreate = {
					from: {
						type: payload.from,
						_id: from._id,
					},
					to: {
						type: payload.to,
						_id: data._id,
					},
					data: {
						event: payload.event,
						value: data.value ? data.value : true,
					},
				};
				mqttCreate(historyCreate);
			}
			break;
		case "Actor":
			data = await actorHandler(payload, socket);
			if (data) {
				from = await Device.findOne({
					mac_addres: payload.mac_addres,
				});
				const historyCreate = {
					from: {
						type: payload.from,
						_id: from._id,
					},
					to: {
						type: payload.to,
						_id: data._id,
					},
					data: {
						event: payload.event,
						value: data.value ? data.value : true,
					},
				};
				mqttCreate(historyCreate);
			}
			break;
		default:
			console.log(payload);
			break;
	}
};
