import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  if (!MONGODB_URI) {
    process.exit(1);
  }

  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    console.log("🔹 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);

  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
