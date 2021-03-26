const emit = (payload, socket) => {
	try {
		const dispatch = socket.of(payload.url);
		dispatch.emit(payload.event, {
			data: payload.payload,
		});
		console.log(`socket emit ${payload.event} to ${payload.url}`);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	emit,
};
