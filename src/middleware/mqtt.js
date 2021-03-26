const errors = require('restify-errors');
const mqttClient = require('../services/mqtt-service');

const sendEmmiter = (req, res, next) => {
	const { dispensor } = req.locals;
	try {
		dispensor.forEach((el) => {
			console.log(el.topic);
			mqttClient.publish(el.topic, JSON.stringify(el.payload));
		});
		next();
	} catch (error) {
		return res.send(new errors.InternalServerError(`${error}`));
	}
};

module.exports = {
	sendEmmiter,
};
