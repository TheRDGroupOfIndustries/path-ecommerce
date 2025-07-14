import jwt from "jsonwebtoken";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export const generateTokens = (user: UserPayload) => {
  const accessToken = jwt.sign(user, process.env.JWT_SECRET as string);

  return { accessToken };
};

export const verifyTokenFromHeader = (authHeader: string): UserPayload | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
  } catch {
    return null;
  }
};
