import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";

export const authMiddleware = (roles: string[]) => {
  return async (req: NextRequest) => {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || !roles.includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Attach user info to request (TypeScript-safe)
    (req as any).user = decoded;
    return null; // Continue request
  };
};
