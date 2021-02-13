const mockDevices = (el, data) => {
  return {
    topic: `Device_${el.mac_addres}`,
    payload: {
      data: {
        port: data.port,
        value: data.value,
      },
    },
  };
};

module.exports = {
  mockDevices,
};
