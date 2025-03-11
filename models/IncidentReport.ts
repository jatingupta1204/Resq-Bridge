import mongoose, { Schema, Document } from "mongoose";
import { IIncident } from "./Incident";
import { IUser } from "./User";

export interface IIncidentReport extends Document {
  emergency: IIncident["_id"];
  reporter: IUser["_id"];
  details: string;
  resolution?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentReportSchema = new Schema<IIncidentReport>(
  {
    emergency: { type: Schema.Types.ObjectId, ref: "Incident", required: true, unique: true },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    details: { type: String, required: true },
    resolution: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.IncidentReport || mongoose.model<IIncidentReport>("IncidentReport", IncidentReportSchema);
