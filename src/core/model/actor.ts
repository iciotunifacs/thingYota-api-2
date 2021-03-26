import { Schema, Document, model } from "mongoose";
import { ActorObject } from "../actor";
import ITimeStamp from "../shared/timestamp/Interface";

export interface ActorDocument extends Document, ActorObject, ITimeStamp {}

const actorSchema = new Schema(
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

export default model<ActorDocument>("Actor", actorSchema);
