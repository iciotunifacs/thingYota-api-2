const constants = require("./constants");

const Sensor = require("../../core/model/sensor");
const Device = require("../../core/model/device");
const Bucket = require("../../core/model/bucket");

const { mockBuckets } = require("../../utils/socket");
const { emit } = require("../socket/bucket");

const updateSensor = async (payload, socket) => {
  try {
    const device = await Device.findOne({ mac_addres: payload.mac_addres });
    const sensor = await Sensor.findOne({
      device_parent: device._id,
      port: payload.Sensor.port,
    });

    if (!device || !sensor) {
      return null;
    }

    if (payload.Sensor.value && payload.Sensor.value.entity) {
      if (payload.Sensor.value.entity == "boolean") {
        switch (payload.Sensor.value.data) {
          case 1:
            payload.Sensor.value.data = true;
            break;
          case 0:
          default:
            payload.Sensor.value.data = false;
            break;
        }
      }
    }

    if (sensor) {
      const data = await sensor
        .update(
          { value: payload.Sensor.value },
          {
            upsert: true,
            useFindAndModify: false,
            new: true,
          }
        )
        .exec();

      const buckets = await Bucket.find({
        Sensors: {
          $in: {
            _id: sensor._id,
          },
        },
      })
        .populate("Sensors")
        .populate("Actors");

      if (buckets.length > 0) {
        buckets.forEach((el) =>
          emit(mockBuckets(el, payload.Sensor, "Sensors"), socket)
        );
      }
    }

    console.info(
      `${payload.to}(${sensor._id}) has moddified to ${payload.from}(${device._id})`
    );
    return sensor;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createSensor = async (payload, socket) => {
  try {
    const device = await Device.findOne({ mac_addres: payload.mac_addres });

    if (!device) {
      return null;
    }

    let sensor;
    const findSensor = await Sensor.findOne({
      device_parent: device._id,
      port: payload.Sensor.port,
    });

    if (findSensor) {
      sensor = await Sensor.findOneAndUpdate(
        { _id: findSensor._id },
        { ...payload.Sensor },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } else {
      sensor = await Sensor.create({
        ...payload.Sensor,
        device_parent: device._id,
      });
    }

    if (!device.Sensors.find((item) => item == sensor.id)) {
      await device.update({
        $push: {
          Sensors: sensor._id,
        },
      });
    }

    console.info(
      `${payload.to}(${sensor._id}) has created to ${payload.from}(${device._id})`
    );

    return sensor;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = (payload, socket) => {
  switch (payload.event) {
    case constants.Sensor.CREATE:
      createSensor(payload, socket);
      break;
    case constants.Sensor.UPDATE:
      updateSensor(payload, socket);
      break;
    default:
      break;
  }
};
