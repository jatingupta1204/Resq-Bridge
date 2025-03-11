import { NextRequest, NextResponse } from "next/server";
import PostIncidentSupport from "@/models/PostIncidentSupport";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const supportEntries = await PostIncidentSupport.find().populate("incident victim");
  return NextResponse.json(supportEntries);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newSupport = new PostIncidentSupport(data);
  await newSupport.save();
  return NextResponse.json(newSupport, { status: 201 });
}
