import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Define the expected JWT payload structure
interface JwtTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtTokenPayload;
  } catch (error) {
    return null;
  }
};
