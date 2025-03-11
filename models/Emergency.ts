import mongoose, { Schema, Document } from "mongoose";

export interface IEmergency extends Document {
  type: string;
  description?: string;
  location: { lat: number; lng: number };
  status: "pending" | "resolved";
  audioRecording?: string; // Store audio as a URL
  timestamp: Date;
}

const EmergencySchema = new Schema<IEmergency>({
  type: { type: String, required: true },
  description: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: { type: String, default: "pending" },
  audioRecording: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Emergency =
  mongoose.models.Emergency || mongoose.model<IEmergency>("Emergency", EmergencySchema);

export default Emergency;
