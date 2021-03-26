import { model, Schema, Document } from "mongoose";
import ITimeStamp from "../shared/timestamp/Interface";
import { DeviceObject } from "../device";
interface DeviceDocument extends Document, DeviceObject, ITimeStamp {}
const deviceSchemme: Schema = new Schema(
  {
    name: {
      type: String,
    },
    type: {
      tyoe: Number,
      default: 0,
    },
    macAddress: {
      type: String,
      required: true,
      unique: true,
    },
    Sensors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sensor",
      },
    ],
    Actors: [
      {
        type: Schema.Types.ObjectId,
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

export default model<DeviceDocument>("Device", deviceSchemme);