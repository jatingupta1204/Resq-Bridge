import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, email, password, role, stauts, joinedAt, action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing 'action' in request body" }, { status: 400 });
    }

    if (action === "register") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }

      const newUser = new User({ name, email, password, role, stauts, joinedAt: new Date()});
      await newUser.save();

      const token = generateToken(newUser._id.toString(), newUser.role);
      return NextResponse.json({ token, user: newUser });
    }

    if (action === "login") {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
    
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    
      const token = generateToken(user._id.toString(), user.role);
      return NextResponse.json({ token, user });
    }
    
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
