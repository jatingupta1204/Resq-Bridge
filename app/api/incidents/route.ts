import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/Incident";
import Emergency from "@/models/Emergency";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await connectDB();
    const incidents = await Incident.find().select("location type");
    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    // Parse the incoming data
    const type = formData.get("type") as string;
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const audioFile = formData.get("audio") as File | null;

    let audioUrl = null;

    if (audioFile) {
      const filePath = path.join(process.cwd(), "public/uploads", audioFile.name);
      const fileBuffer = Buffer.from(await audioFile.arrayBuffer());
      await writeFile(filePath, fileBuffer);
      audioUrl = `/uploads/${audioFile.name}`;
    }

    const newEmergency = await Emergency.create({
      type,
      location: { lat, lng },
      audioRecording: audioUrl,
    });

    return NextResponse.json({ success: true, emergency: newEmergency }, { status: 201 });
  } catch (error) {
    console.error("Error saving emergency:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
