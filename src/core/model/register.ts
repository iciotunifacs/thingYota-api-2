import { Document, model, Schema } from "mongoose";
import { RegisterObject } from "../register";
import ITimeStamp from "../shared/timestamp/Interface";
export interface RegisterDocument
  extends Document,
    RegisterObject,
    ITimeStamp {}

const registerSchema = new Schema(
  {
    Fk_device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    // No use refer because is have varios types
    Fk_Sensor: {
      type: Schema.Types.ObjectId,
      ref: "Sensor",
      default: null,
    },
    Fk_Actor: {
      type: Schema.Types.ObjectId,
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

export default model<RegisterDocument>("Register", registerSchema);
