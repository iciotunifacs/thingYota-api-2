import { model, Schema, Document } from "mongoose";
import { HistoryObject } from "../core/history";
import ITimeStamp from "../core/shared/timestamp/Interface";
export interface HistoryDocument extends Document, HistoryObject {
  timestamp: ITimeStamp;
}
const HistoryScheme = new Schema(
  {
    From_type: {
      type: String,
    },
    From: {
      type: Schema.Types.ObjectId,
      refPath: "From_type",
    },
    To: {
      type: Schema.Types.ObjectId,
      refPath: "To_type",
    },
    To_type: {
      type: String,
    },

    data: {
      type: Object,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_change",
    },
  }
);

export default model<HistoryDocument>("History", HistoryScheme);
