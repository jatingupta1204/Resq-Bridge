import { NextRequest, NextResponse } from "next/server";
import Responder from "@/models/Responder";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const responders = await Responder.find();
  return NextResponse.json(responders);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newResponder = new Responder(data);
  await newResponder.save();
  return NextResponse.json(newResponder, { status: 201 });
}
