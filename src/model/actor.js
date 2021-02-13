const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    port: {
      type: String,
      required: true,
    },
    device_parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    type: {
      type: String,
      default: "motor",
    },
    value: {
      type: Object,
    },
    status: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_change",
    },
  }
);

module.exports = mongoose.model("Actor", actorSchema);
