const errors = require("restify-errors");

const responseOk = (req, res, send) => {
  try {
    const { data } = req.locals;
    res.send(200, {
      data: data,
    });
  } catch (error) {
    res.send(new errors.InternalServerError(`${error}`));
  }
};

module.exports = {
  responseOk,
};
