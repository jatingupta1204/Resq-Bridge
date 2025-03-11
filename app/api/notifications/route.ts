import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/Notification";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const notifications = await Notification.find();
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newNotification = new Notification(data);
  await newNotification.save();
  return NextResponse.json(newNotification, { status: 201 });
}
