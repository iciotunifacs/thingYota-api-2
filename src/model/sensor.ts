import { model, Document, Schema } from "mongoose";
import ITimeStamp from "../core/shared/timestamp/Interface";
import { SensorObject } from "../core/sensor/";
export interface SensorDocument extends SensorObject, ITimeStamp, Document {}
const sensorSchema = new Schema(
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
      type: Schema.Types.ObjectId,
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

export default model<SensorDocument>("Sensor", sensorSchema);
