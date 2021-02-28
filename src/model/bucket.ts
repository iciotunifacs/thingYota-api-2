import Mongoose, { Schema, Document } from "mongoose";
import ITimeStamp from "../core/shared/timestamp/Interface";
import { BucketObject } from "../core/bucket/";

export interface DeviceDocument extends BucketObject, Document {
  timestamp: ITimeStamp;
}
const bucketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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

export default Mongoose.model<DeviceDocument>("Bucket", bucketSchema);
