import { Request, Response, Next } from "restify";
import errors from "restify-errors";

import User from "../model/user";
import Bucket from "../model/bucket";
import { validaionBodyEmpty, trimObjctt } from "../utils/common";
import mongoose from "mongoose";

/**
 * @description Get alll users use queeryparans to filter then
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const find = async (req: Request, res: Response, next: Next) => {
  const { limit } = req.query;
  const offset = (parseInt(req.query?.offset) - 1) * limit || 0;
  try {
    const data = await User.find()
      .limit(parseInt(limit) || 0)
      .skip(offset || 0)
      .exec();

    const total = await User.estimatedDocumentCount();

    if (offset >= total && total != 0)
      return res.send(new errors.LengthRequiredError("out of rnge"));

    return res.send(200, {
      data: data,
      metadata: { limit, offset, total },
    });
  } catch (error) {
    return res.send(new errors.InternalServerError(`${error}`));
  }
};

/**
 * @description Create user
 * @param {{body: {fristName: String, userName: String, lastName?: String}}} req
 * @param {Response} res
 * @param {next} next
 * @requires req
 */
const create = async (req: Request, res: Response, next: Next) => {
  if (!req.body) {
    return res.send(new errors.InvalidArgumentError("body is empty"));
  }

  const { username, first_name, last_name, password, email } = req.body;

  try {
    const user = new User({
      username,
      first_name,
      status: true,
      bucket: [],
      last_name,
      email,
      password,
    });

    await user.validate();

    if (user) {
      const result = await User.insertMany([user], { rawResult: true });
      return res.send(201, { data: result.ops });
    } else {
      return res.send(new errors.InternalError(`error in server ${user}`));
    }
  } catch (error) {
    if (error.code == 11000) {
      return res.send(
        new errors.ConflictError(
          `duplicated : ${JSON.stringify(error.keyValue)}`
        )
      );
    } else if (error instanceof mongoose.Error.ValidationError) {
      return res.send(new errors.InvalidContentError(error));
    }
    return res.send(new errors.InternalServerError(error));
  }
};

const findOne = async (req: Request, res: Response, next: Next) => {
  const { id } = req.params;
  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  try {
    const data = await User.findById(req.params.id);

    if (!data)
      return res.send(new errors.NotFoundError(`User_id ${id} not found`));

    return res.send(200, {
      res: true,
      data: data,
    });
  } catch (error) {
    return res.send(
      new errors.InternalServerError(`An database error has occoured`)
    );
  }
};

/**
 * @description Put data update in refs by pk id
 * @param {{params: {id: String}, body:{name?: String, type?: String, next: Boolean}}} req
 * @param {Response} res
 * @param {*} next
 */
const put = async (req: Request, res: Response, next: Next) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  const { id } = req.params;
  const { type, status, username, first_name, last_name, email } = req.body;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  let nextParans = trimObjctt({
    type,
    status,
    username,
    first_name,
    last_name,
    email,
  });

  try {
    const user = await User.findByIdAndUpdate(id, nextParans, {
      useFindAndModify: false,
    });

    if (!user)
      return res.send(new errors.NotFoundError(`User_id ${id} not found`));

    return res.send(200, { data: user });
  } catch (error) {
    res.send(new errors.InternalServerError(`${error}`));
  }
};

/**
 * @description Create relationship using user
 * @param {{body: {to: String, type: String}, params: {id: String}}} req
 * @param {Response} res
 * @param {Next} next
 */
const createRelationShip = async (req: Request, res: Response, next: Next) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  const { id } = req.params;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  const bodyNotFound = validaionBodyEmpty(req.body, ["to", "type"]);

  if (bodyNotFound.length > 0)
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );

  const { to, type } = req.body;

  const user = await User.findById(req.params.id);

  if (!user)
    return res.send(new errors.NotFoundError(`User._id ${id} not found`));

  let dataTo, data;

  try {
    switch (type) {
      case "Bucket":
      case "bucket":
        dataTo = await Bucket.findById(to.id);

        if (!dataTo)
          return res.send(
            new errors.NotFoundError(
              `Bucket._id ${JSON.stringify(to.id)} not found`
            )
          );

        data = await User.findByIdAndUpdate(
          id,
          {
            $push: {
              Buckets: dataTo._id,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );
        break;
      default:
        return res.send(
          new errors.InvalidContentError(`type ${type} is not valid.`)
        );
    }

    return res.send(200, {
      data: data,
    });
  } catch (error) {
    return res.send(new errors.InternalServerError(error));
  }
};

/**
 * @description Delete relationship using user
 * @param {{body: {to: String, type: String}, params: {id: String}}} req
 * @param {Response} res
 * @param {Next} next
 */
const deleteRelationShip = async (req: Request, res: Response, next: Next) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  const { id } = req.params;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  const bodyNotFound = validaionBodyEmpty(req.body, ["to", "type"]);

  if (bodyNotFound.length > 0)
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );

  const { to, type } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.send(new errors.NotFoundError(`User._id ${id} not found`));
  }

  let dataTo, data;

  try {
    switch (type) {
      case "Bucket":
      case "bucket":
        dataTo = await Bucket.findById(to.id);

        if (!dataTo)
          return res.send(
            new errors.NotFoundError(
              `Bucket._id ${JSON.stringify(to.id)} not found`
            )
          );

        data = await User.findByIdAndUpdate(
          id,
          {
            $pull: {
              Buckets: dataTo._id,
            },
          },
          { new: true }
        );
        break;
      default:
        return res.send(
          new errors.InvalidContentError(`type ${type} is not valid.`)
        );
    }

    return res.send(200, {
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.send(new errors.InternalServerError(error));
  }
};

module.exports = {
  find,
  findOne,
  create,
  put,
  createRelationShip,
  deleteRelationShip,
};
