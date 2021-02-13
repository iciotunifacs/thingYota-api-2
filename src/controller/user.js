const User = require("../model/user");
const Bucket = require("../model/bucket");
const md5 = require("md5");
const { validaionBodyEmpty, trimObjctt } = require("../utils/common");
const errors = require("restify-errors");

/**
 * @description Get alll users use queeryparans to filter then
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const find = async (req, res, next) => {
  const { limit } = req.query;
  const offset = (req.query.offset - 1) * limit || 0;
  try {
    const data = await User.find()
      .limit(parseInt(limit) || 0)
      .skip(parseInt(offset) || 0)
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
const create = async (req, res, next) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  const bodyNotFound = validaionBodyEmpty(req.body, [
    "username",
    "email",
    "first_name",
    "password",
  ]);

  if (bodyNotFound.length > 0)
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );

  const { username, first_name, last_name, password, email } = req.body;

  User.create({
    username,
    first_name,
    last_name,
    email,
    password,
  })
    .then((data) => res.send(201, { data: data }))
    .catch((error) => {
      if (error.code == 11000) {
        return res.send(
          new errors.ConflictError(
            `duplicated : ${JSON.stringify(error.keyValue)}`
          )
        );
      }
      console.log(error);
      return res.send(
        new errors.InternalServerError(`An database error has occoured`)
      );
    });
};

const findOne = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  try {
    const data = await User.findById(req.params.id);

    if (!data || data.length == 0)
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
 * @param {{params: {id: String}, body:{name?: String, type?: String, send: Boolean}}} req
 * @param {Response} res
 * @param {*} send
 */
const put = async (req, res, send) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  const { id } = req.params;
  const { type, status, username, first_name, last_name, email } = req.body;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  let sendParans = trimObjctt({
    type,
    status,
    username,
    first_name,
    last_name,
    email,
  });

  try {
    const user = await User.findByIdAndUpdate(id, sendParans, {
      useFindAndModify: false,
    });

    if (!user || user.length == 0)
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
 * @param {Next} send
 */
const createRelationShip = async (req, res, send) => {
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

  if (!user || user.length == 0)
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
 * @param {Next} send
 */
const deleteRelationShip = async (req, res, send) => {
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

  if (!user || user.length == 0)
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
