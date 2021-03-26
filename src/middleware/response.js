const responseOk = (req, res, send) => {
	try {
		const { data } = req.locals;
		return res.send(200, {
			data: data,
		});
	} catch (error) {
		return res.send(new errors.InternalServerError(`${error}`));
	}
};

module.exports = {
	responseOk,
};
