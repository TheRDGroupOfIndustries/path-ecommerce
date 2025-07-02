import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

interface Tokens {
  accessToken: string;
}

export const generateTokens = (user: UserPayload): Tokens => {
  const payload: UserPayload = { id: user.id, email: user.email };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string);
  return { accessToken };
};

export const verifyToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1]; // ✅ extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    return decoded.id;
  } catch (err) {
    return false;
  }
};

