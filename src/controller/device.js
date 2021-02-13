const Device = require("../model/device");
const { validaionBodyEmpty, trimObjctt } = require("../utils/common");
const errors = require("restify-errors");
const { populate } = require("../model/device");

/**
 * @description Get all Devices in database
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
const find = async (req, res, next) => {
  const { limit, populate } = req.query;
  const offset = (parseInt(req.query.offset)) * limit || 0;
  try {
    let data;
    if (populate) {
      data = await Device.find()
        .limit(parseInt(limit) || 0)
        .skip(parseInt(offset) || 0)
        .populate("Sensors")
        .populate("Actors")
        .exec();
    } else {
      data = await Device.find()
        .limit(parseInt(limit) || 0)
        .skip(parseInt(offset) || 0)
        .exec();
    }

    const total = await Device.estimatedDocumentCount();

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
 * @description Get one Device using your PK value id
 * @param {{params: {id: string}}} req
 * @param {Response} res
 * @requires params.id
 * @param {*} next
 */
const findOne = async (req, res, next) => {
  const { populate } = req.query;
  const { id } = req.params;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  try {
    let data;
    if (populate) {
      data = await Device.findById(id)
        .populate("Sensors")
        .populate("Actrors")
        .exec();
    } else {
      data = await Device.findById(id);
    }

    if (!data || data.length == 0)
      return res.send(new errors.NotFoundError(`Device._id ${id} not found`));

    return res.send(200, {
      data: data,
    });
  } catch (error) {
    return res.send(new errors.InternalServerError(`${error}`));
  }
};

/**
 * @description Create device
 * @param {{body: {name: String, type: String, mac_addres}}} req
 * @param {Response} res
 * @param {next} next
 * @requires body.name
 * @requires body.type
 * @requires body.mac_addres
 */
const create = async (req, res, next) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  const bodyNotFound = validaionBodyEmpty(req.body, [
    "name",
    "type",
    "mac_addres",
  ]);

  if (bodyNotFound.length > 0)
    return res.send(
      new errors.NotFoundError(`not found params : ${bodyNotFound.join(",")}`)
    );

  const { name, type, mac_addres } = req.body;

  try {
    const data = await Device.create({
      name,
      type,
      mac_addres,
    });

    return res.send(200, {
      data: data,
    });
  } catch (error) {
    if (error.code == 11000) {
      return res.send(
        new errors.ConflictError(
          `duplicated : ${JSON.stringify(error.keyValue)}`
        )
      );
    }
    return res.send(
      new errors.InternalServerError(`An database error has occoured`)
    );
  }
};

/**
 * @description Put data update in refs by pk id
 * @param {{params: {id: String}, body:{name?: String, type?: String, status: Boolean}}} req
 * @param {Response} res
 * @param {*} send
 */
const put = async (req, res, send) => {
  if (req.body == null || req.body == undefined)
    return res.send(new errors.InvalidArgumentError("body is empty"));

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  const { id } = req.params;
  const { name, type, mac_addres, status } = req.body;

  const sendParans = trimObjctt({
    name,
    type,
    mac_addres,
    status,
  });

  try {
    const data = await Device.findByIdAndUpdate(id, sendParans, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    if (!data)
      return res.send(new errors.NotFoundError(`Device ${id} not found`));
  } catch (error) {
    return res.send(new errors.InternalServerError(`${error}`));
  }
};

module.exports = {
  findOne,
  find,
  create,
  put,
};
