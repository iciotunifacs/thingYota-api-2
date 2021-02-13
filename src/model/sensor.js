const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema(
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
      default: "wather-sensor",
    },
    value: {
      type: Object,
      default: { data: true, entity: "boolean" },
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_change",
    },
  }
);

module.exports = mongoose.model("Sensor", sensorSchema);
