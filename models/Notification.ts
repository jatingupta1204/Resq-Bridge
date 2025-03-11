import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
  SYSTEM_ALERT = "SYSTEM_ALERT",
  BROADCAST = "BROADCAST",
  ESCALATION = "ESCALATION",
}

export interface INotification extends Document {
  type: NotificationType;
  message: string;
  recipientIds: string[];
  isRead: boolean;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: { type: String, enum: Object.values(NotificationType), required: true },
    message: { type: String, required: true },
    recipientIds: { type: [String], required: true },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
