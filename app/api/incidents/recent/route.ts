import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/Incident";

export async function GET() {
  try {
    await connectDB();
    const incidents = await Incident.find().sort({ timestamp: -1 }).limit(5);
    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Error fetching recent incidents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}