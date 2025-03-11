import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IIncident } from "./Incident";

export enum SupportType {
  MEDICAL = "MEDICAL",
  COUNSELING = "COUNSELING",
  LEGAL = "LEGAL",
}

export interface IPostIncidentSupport extends Document {
  incident: IIncident["_id"];
  victim: IUser["_id"];
  supportType: SupportType;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostIncidentSupportSchema = new Schema<IPostIncidentSupport>(
  {
    incident: { type: Schema.Types.ObjectId, ref: "Incident", required: true },
    victim: { type: Schema.Types.ObjectId, ref: "User", required: true },
    supportType: { type: String, enum: Object.values(SupportType), required: true },
    feedback: { type: String },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.PostIncidentSupport ||
  mongoose.model<IPostIncidentSupport>("PostIncidentSupport", PostIncidentSupportSchema);
