import mongoose, { Schema, Document } from "mongoose";

interface IResponder extends Document {
  name: string;
  department: string;
  location: string;
  isAvailable: boolean;
}

const ResponderSchema = new Schema<IResponder>({
  name: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

export default mongoose.models.Responder || mongoose.model<IResponder>("Responder", ResponderSchema);
