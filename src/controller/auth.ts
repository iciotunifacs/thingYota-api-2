import { Request, Response, Next } from "restify";
import errors from "restify-errors";

import config from "../config/env";
import { compare } from "../core/user";
import { sendEmmiter } from "../middleware/mqtt";
import User from "../model/user";

const Device = require("../model/device");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const { validaionBodyEmpty, trimObjctt } = require("../utils/common");

/**
 * @description Handler to verified troken acess
 * @param {Request} req
 * @param {Response} res
 */
const authUser = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.send(new errors.InvalidArgumentError("body is empty"));
  }

  const bodyNotFound = validaionBodyEmpty(req.body, ["username", "password"]);

  if (bodyNotFound.length > 0) {
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );
  }

  let { username, email, password } = req.body;

  const user = await User.findOne({ email: username });

  if (!user) {
    return res.send(
      new errors.NotAuthorizedError("incorrect password or username")
    );
  }

  if (!user.status) {
    return res.send(new errors.InvalidCredentialsError("user is not active"));
  }

  const comparePassword = compare(password, user.password);

  if (comparePassword.tag == "left") {
    return res.send(comparePassword.value);
  }

  if (comparePassword.tag == "right" && !comparePassword.value) {
    return res.send(
      new errors.NotAuthorizedError("incorrect password or username")
    );
  }

  const token = await jwt.sign(
    {
      username: user.username,
      email: user.email,
      status: user.status,
      id: user._id,
      entity: "User",
    },
    config.secret.user
  );
  return res.send(200, {
    res: true,
    data: {
      token,
      user: {
        username: user.username,
        email: user.email,
        status: user.status,
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    },
  });
};

/**
 * @description Auth Device in system
 * @param {Request} req
 * @param {Response} res
 * @param {Next} send
 * @requires req.body.mac_addres
 */
const authDevice = async (req: Request, res: Response, send: Next) => {
  if (req.body == null || req.body == undefined) {
    return res.send(new errors.InvalidArgumentError("body is empty"));
  }
  const bodyNotFound = validaionBodyEmpty(req.body, ["mac_addres"]);
  if (bodyNotFound.length > 0) {
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );
  }

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
 * @param {Next} send
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
