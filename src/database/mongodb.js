const mongoose = require("mongoose");
const env = require("../config/env");

const url = env.db.username
  ? `${env.db.url}://${env.db.username}:${env.db.password}@${env.db.host}/${env.db.database}`
  : `${env.db.url}://${env.db.host}/${env.db.database}`;
module.exports = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
