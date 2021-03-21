import mongoose from "mongoose";
import config from "../config/env";

const url = config.db.username
  ? `${config.db.url}://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.database}`
  : `${config.db.url}://${config.db.host}/${config.db.database}`;
module.exports = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
