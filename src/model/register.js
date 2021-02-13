const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(
  {
    Fk_device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    // No use refer because is have varios types
    Fk_Sensor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      default: null,
    },
    Fk_Actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
      default: null,
    },
    value: {
      type: String,
      default: "0",
      required: true,
    },
    type: {
      type: String,
      default: "Sensor",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_change",
    },
  }
);

module.exports = mongoose.model("Register", registerSchema);
