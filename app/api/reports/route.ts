import { NextRequest, NextResponse } from "next/server";
import IncidentReport from "@/models/IncidentReport";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const reports = await IncidentReport.find().populate("emergency reporter");
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newReport = new IncidentReport(data);
  await newReport.save();
  return NextResponse.json(newReport, { status: 201 });
}
