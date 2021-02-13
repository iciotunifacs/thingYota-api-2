const User = require("../model/user");
const Device = require("../model/device");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const errors = require("restify-errors");

/**
 * @description Função que valida o token de huest
 * @param {Rwquest} req
 * @param {Response} res
 * @param {Send'} send
 */
const authGuest = async (req, res, send) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || token == null)
    return res.send(new errors.InvalidHeaderError("Token not found"));

  jwt.verify(token, config.secret.guest, (err, decoded) => {
    if (err)
      return res.send(403, {
        error: { message: "token is not valid" },
      });
    req.token = token;
    send();
  });
};

/**
 * @description Função que valida o token de um usuário
 * @param {Rwquest} req
 * @param {Response} res
 * @param {Send'} send
 */
const authUser = async (req, res, send) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || token == null)
    return res.send(new errors.InvalidHeaderError("Token not found"));

  jwt.verify(token, config.secret.user, (err, decoded) => {
    if (err) return res.send(new errors.InvalidHeaderError("Invalid Token"));
  });

  const { entity, id } = jwt.decode(token);
  if (!entity)
    return res.send(new errors.InvalidArgumentError("Entity info not found "));
  let data = {};

  switch (entity) {
    case "User":
      data = await User.findById(id);
      break;
    case "Device":
      data = await Device.findById(id);
      break;
    case "Guest":
      data = { entity };
      break;
    default:
      data = {};
  }

  if (!data)
    return res.send(
      new errors.InvalidArgumentError(`Entity ${entity} id (${id}) not found`)
    );
  req.token = token;
  req.locals = {
    authObject: {...data._doc, entity}
  };
  send();
};

module.exports = {
  authUser,
  authGuest,
};
