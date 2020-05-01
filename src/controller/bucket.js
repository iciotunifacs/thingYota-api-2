const Bucket = require('../model/bucket');
const Sensor = require('../model/sensor');
const Actor = require('../model/actor');
const {validaionBodyEmpty, trimObjctt} = require('../utils/common');
const errors = require('restify-errors');

/**
 * @description Get all buckets in database
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
const find = async (req,res,next) => {
  const {limit} = req.query
  const offset = (req.query.offset -1) * limit || 0
  try{
    const data = await Bucket.find()
      .limit(parseInt(limit) || 0)
      .skip(parseInt(offset) || 0)
      .exec()

    const total =await Bucket.estimatedDocumentCount()

    if (offset >= total && total != 0) return res.send(new errors.LengthRequiredError("out of rnge"))

    if (!data || data.length == 0) return res.send(new errors.NotFoundError("Bucket not found"))

    return res.send(200, {
      data: data,
      metadata: {limit, offset, total }
    })
  } catch(error) {
    return res.send(new errors.InternalServerError(error))
  }
}

/**
 * @description Get one bucket using your PK value id
 * @param {{params: {id: string}}} req
 * @param {Response} res
 * @requires params.id
 * @param {*} next
 */
const findOne = async (req,res,next) => {
  const {id} = req.params;
  if (!id) return res.send(new errors.InvalidArgumentError("id not found"))
  try{
    const data = await Bucket.findById(req.params.id);

    if (!data || data.length == 0) return res.send(new errors.NotFoundError(`Bucket._id ${id} not found`))

    res.send(200, {
      data: data,
    })
  } catch(error) {
    return res.send(new errors.InternalServerError(error))
  }
}

/**
 * @description Create user
 * @param {{body: {name: String, type: String}}} req
 * @param {Response} res
 * @param {next} next
 * @requires body.name
 * @requires body.type
 */
const create =  async (req,res,next) => {
  if (req.body == null || req.body == undefined) return res.send(new errors.InvalidArgumentError("body is empty"))


  const bodyNotFound = validaionBodyEmpty(req.body, ['name', 'type']);

  if(bodyNotFound.length > 0) return res.send(new errors.NotFoundError(`not found params : ${bodyNotFound.join(',')}`))

  const {name, type} = req.body;

  const sendData = trimObjctt({
    name,
    type,
    create_at: Date()
  })
  try {
    const data = await Bucket.create(sendData)
    return res.send(201, {
        data: data,
    })
  } catch (error) {
    return res.send(new errors.InternalServerError(error))
  }
}

/**
 * @description Put data update in refs by pk id
 * @param {{params: {id: String}, body:{name?: String, type?: String, send: Boolean}}} req
 * @param {Response} res
 * @param {*} send
 */
const put = async (req,res,send) => {
  if (req.body == null || req.body == undefined) return res.send(new errors.InvalidArgumentError("body is empty"))

  const {id} = req.params;
  const {name, type, status} = req.body;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  const sendParans = trimObjctt({name, type, status});

  try {
    const data = await Bucket.findByIdAndUpdate(id, sendParans, {new: true})
    if (!data) return res.send(new errors.NotFoundError(`Bucket_id ${id} not found`))
    return res.send(200, {
      data: data
    })
  } catch (error) {
    return res.send(new errors.InternalServerError(error))
  }
}

const createRelationShip = async (req, res, send) => {
  if (req.body == null || req.body == undefined) return res.send(new errors.InvalidArgumentError("body is empty"))

  const {id} = req.params;

  if (!id) return res.send(new errors.InvalidArgumentError("id not found"));

  const bodyNotFound = validaionBodyEmpty(req.body, ['to', 'type']);

  if(bodyNotFound.length > 0) return res.send(new errors.NotFoundError(`not found params : ${bodyNotFound.join(',')}`))

  const {to, type} = req.body;

  const bucket = await Bucket.findById(req.params.id);

  if (!bucket || bucket.length == 0) return res.send(new errors.NotFoundError(`Bucket._id ${id} not found`))

  let dataTo, data;

  try {
    switch(type) {
      case "Sensor":
      case "sensor":
        dataTo = await Sensor.findById(to.id);

        if (!dataTo) return res.send(new errors.NotFoundError(`Sensor._id ${to.id} not found`))

        data = await Bucket.findByIdAndUpdate(id, {
          $push: {
            Sensors: dataTo._id
          }
        })
        break;
      case "Actor":
      case "actor":
        dataTo = await Actor.findById(to.id);

        if (!dataTo) return res.send(new errors.NotFoundError(`Sensor._id ${to.id} not found`))

        data = await Bucket.findByIdAndUpdate(id, {
          $push: {
            Actors: dataTo._id
          }
        })
        break;
      default:
        return res.send(new errors.InvalidContentError(`type ${type} is not valid.`))
    }

    return res.send(200, {
      data: data
    })
  } catch (error) {
    return res.send(new errors.InternalServerError(error))
  }
}

module.exports = {
  findOne,
  find,
  create,
  put,
  createRelationShip
}