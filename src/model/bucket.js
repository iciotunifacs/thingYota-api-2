const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    type: {
      type: String,
      default: "wather-bucket",
    },
    volume: {
      type: Object,
      default: { data: { value: 0, unity: "L" } },
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

module.exports = mongoose.model("Bucket", bucketSchema);
