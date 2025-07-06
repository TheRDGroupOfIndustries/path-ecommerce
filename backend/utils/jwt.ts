import { Request } from "express";
import jwt from "jsonwebtoken";

// ✅ Extended payload includes role
export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

interface Tokens {
  accessToken: string;
}

// ✅ Token generation with full payload
export const generateTokens = (user: UserPayload): Tokens => {
  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d", // Optional: set expiry
  });

  return { accessToken };
};

// ✅ Token verification returns full payload
export const verifyToken = (req: Request): UserPayload | false => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    return decoded;
  } catch (err) {
    return false;
  }
};
