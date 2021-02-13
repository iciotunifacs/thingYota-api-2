const jwt = require("jsonwebtoken"),
  config = require("../config/env"),
  Device = require("../model/device"),
  User = require("../model/user");

/**
 * @description Função que valida o token de um arduino via socketio
 * @param {JSON} data
 * @param {WebSocketEventMap} socket
 * @param {WebSocket} io
 */
const authUser = (data, socket, io) => {
  const user = User.findOne(data);
  if (user) {
    const private = socket.join(user.username);
    private.emit("responseOk", {
      res: true,
      data: {
        user,
        message: "ok",
      },
    });
  }
  return;
};

/**
 * @description Autenticação de arduino no socket
 * @param {WebSocket} socket
 * @param {Object} data
 */
const authArduino = async (socket, data) => {
  const device = await Device.findOne(data);
  if (device) {
    const private = socket.join(device.mac_addres);
    private.emit("responseOk", {
      data: {
        device,
        message: "Ok",
      },
    });
  }
  return;
};

module.exports = {
  authUser,
  authArduino,
};
