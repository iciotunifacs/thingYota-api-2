import { Request, Response, Next } from "restify";
import config from "../config/env";

const User = require("../model/user");
const Device = require("../model/device");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { validaionBodyEmpty, trimObjctt } = require("../utils/common");
const errors = require("restify-errors");

/**
 * @description Handler to verified troken acess
 * @param {Request} req
 * @param {Response} res
 * @param {Send} send
 */
const authUser = async (req: Request, res: Response, send: Next) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  const bodyNotFound = validaionBodyEmpty(req.body, ["username", "password"]);

  if (bodyNotFound.length > 0)
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );

  let { username, email, password } = req.body;

  let query = trimObjctt({
    password: md5(password),
    email: username,
  });

  const user = await User.findOne(query);

  if (!user || user.length == 0)
    return res.send(new errors.NotFoundError("User not found"));

  const token = await jwt.sign(
    {
      username: user.username,
      password: user.password,
      id: user._id,
      entity: "User",
    },
    config.secret.user
  );
  return res.send(200, {
    res: true,
    data: {
      token,
      user,
    },
  });
};

/**
 * @description Auth Device in system
 * @param {Request} req
 * @param {Response} res
 * @param {Send} send
 * @requires req.body.mac_addres
 */
const authDevice = async (req: Request, res: Response, send: Next) => {
  if (req.body == null || req.body == undefined) {
    return res.send(new errors.InvalidArgumentError("body is empty"));
  }
  const bodyNotFound = validaionBodyEmpty(req.body, ["mac_addres"]);
  if (bodyNotFound.length > 0)
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );

  const { mac_addres } = req.body;

  let query = trimObjctt({
    mac_addres,
  });

  const device = await Device.findOne(query);

  if (!device || device.length == 0)
    return res.send(new errors.NotFoundError("Device not found"));

  const token = await jwt.sign(
    {
      name: device.name,
      mac_addres: device.mac_addres,
      id: device._id,
      entity: "Device",
    },
    config.secret.user
  );
  return res.send(200, {
    res: true,
    data: {
      token,
      device,
    },
  });
};

/**
 * @description Auth guest in system
 * @param {Request} req
 * @param {Response} res
 * @param {Send} send
 */
const authGuest = async (req: Request, res: Response, send: Next) => {
  const token = await jwt.sign(
    {
      entity: "Guest",
    },
    config.secret.guest
  );
  return res.send(200, {
    data: {
      token,
    },
  });
};

export { authUser, authDevice, authGuest };
