const History = require("../core/model/history");
const errors = require("restify-errors");

/**
 * @description Get all histories in database
 * @param {Request} req
 * @param {Response} res
 * @param {*} send
 */
const find = async (req, res, send) => {
  const { limit } = req.query;
  const offset = parseInt(req.query.offset) * limit || 0;
  let filter;
  try {
    if (req.body) filter = req.body;
    const data = await History.find(filter)
      .limit(parseInt(limit) || 0)
      .skip(parseInt(offset) || 0)
      .populate("From")
      .populate("To")
      .sort({ created_at: -1 })
      .exec();

    const total = await History.estimatedDocumentCount();

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
 * @description Get one History using your PK value id
 * @param {{params: {id: string}}} req
 * @param {Response} res
 * @requires params.id
 * @param {*} next
 */
const findOne = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  try {
    const data = await History.findById(id).populate("device_parent");

    if (!data || data.length == 0)
      return res.send(new errors.NotFoundError("Sensor not found"));

    res.send(200, {
      res: true,
      data: data,
    });
  } catch (error) {
    return res.send(new errors.InternalServerError(`${error}`));
  }
};

/**
 * @description handler to create history from mqtt handlers
 * @param {{From_type: String, From: String, To_Type: String, To: String, data: any}} payload
 */
const mqttCreate = async (payload) => {
  try {
    const data = await History.create({
      From_type: payload.from.type,
      From: payload.from._id,
      To_type: payload.to.type,
      To: payload.to._id,
      data: payload.data,
    });
    console.info(
      `${payload.from.type}(${payload.from._id}) has referenced for ${payload.to.type} (${payload.to._id}) in history`
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description handler to delete one history using id to reference
 * @param {{params: {id: String}}} req
 * @param {Response} res
 * @param {Send} next
 */
const delOne = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  try {
    const data = await History.findById(id).populate("device_parent");
    await data.deleteOne();
    return res.send(200, {
      data,
      res: true,
    });
  } catch (error) {
    return res.send(new errors.InternalServerError(`${error}`));
  }
};

module.exports = {
  findOne,
  find,
  mqttCreate,
  delOne,
};
