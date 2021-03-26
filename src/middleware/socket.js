const errors = require("restify-errors");

const sendEmmiter = (req, res, next) => {
	const { recives } = req.locals;
	try {
		if (recives.length > 0) {
			recives.forEach((el) => {
				const dispatch = req.io.of(el.url);
				dispatch.emit(el.event, {
					data: el.payload,
				});
			});
		}
		next();
	} catch (error) {
		return res.send(new errors.InternalServerError(`${error}`));
	}
};

module.exports = {
	sendEmmiter,
};
