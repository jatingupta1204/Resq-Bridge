import { NextResponse } from "next/server"
import {connectDB} from "@/lib/db"
import User, { IUser } from "@/models/User"

// Fetch all users
export async function GET() {
  try {
    await connectDB()
    const users: IUser[] = await User.find({})
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error }, { status: 500 })
  }
}

// Delete a user
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await connectDB()
    await User.findByIdAndDelete(id)
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting user", error }, { status: 500 })
  }
}

// Update a user
export async function PUT(req: Request) {
  try {
    const { _id, name, email, role, status, joinedAt } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, email, role, status, joinedAt },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}