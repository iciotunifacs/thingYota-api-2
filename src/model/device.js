const mongoose = require("mongoose");

const deviceSchemme = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    mac_addres: {
      type: String,
      required: true,
      unique: true,
    },
    Sensors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
      },
    ],
    Actors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
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

module.exports = mongoose.model("Device", deviceSchemme);
