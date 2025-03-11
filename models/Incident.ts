import mongoose, { Schema, Document } from "mongoose";

interface IIncident extends Document {
  type: string;
  description: string;
  location: string;
  status: string;
  userId: mongoose.Types.ObjectId;
  responderId?: mongoose.Types.ObjectId;
  audioRecording?: string;
  timestamp: Date;
  resolutionTime?: Date;
}

const IncidentSchema = new Schema<IIncident>({
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "resolved"], required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  responderId: { type: Schema.Types.ObjectId, ref: "Responder" },
  audioRecording: { type: String },
  timestamp: { type: Date, default: Date.now },
  resolutionTime: { type: Date },
});

export default mongoose.models.Incident || mongoose.model<IIncident>("Incident", IncidentSchema);
