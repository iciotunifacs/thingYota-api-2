const constants = require('./constants');

const Devive = require('../../model/device');

const updateDevice = async (payload, socket) => {
  try {
    const {mac_addres, name, type="ESP"} = payload;
    const data = await Devive.findOneAndUpdate({mac_addres}, {
      name,
      type
    }, {
      upsert: true
    });
    console.info(`${payload.from}(${data._id}) has updated`);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const createDevice = async (payload, socket) => {
  try {
    const {name, mac_addres, type="ESP"} = payload;
    const device = await Devive.find({
      mac_addres
    })

    if (device && device.length > 0) {
      return updateDevice(payload, socket);
    }

    const data = await Devive.create({
      name,
      mac_addres,
      type
    });
    console.info(`${payload.from}(${data._id}) has created`);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports= (payload, socket) => {
  switch (payload.event) {
    case constants.Device.CREATE:
      return createDevice(payload, socket)
    case constants.Device.UPDATE:
      return updateDevice(payload, socket);
    default:
      return null;
  }
}
