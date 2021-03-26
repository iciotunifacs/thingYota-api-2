const { authUser, authArduino } = require('./auth');

/**
 * @description Handler for socket 'on connected
 * @param {function} socket
 */
const onConnectUser = (socket, io) => {
	// implementação de coneão genérica
	console.log('new connection with user');

	// autenticação
	socket.on('userAuth', (data) => {
		authUser(data, socket, io);
	});
};
/**
 * @description Handler for socket 'on connected
 * @param {function} socket
 */
const onConnectArduino = (socket, io) => {
	// implementação de coneão genérica
	console.log('new connection with arduino');
	// calback intened
	socket.on('arduinoAuth', async (data) => {
		// gera o token do socket para arduino
		// await authUser(data)
		authArduino(data, socket, io);
	});
};

module.exports = {
	onConnectArduino,
	onConnectUser,
};
