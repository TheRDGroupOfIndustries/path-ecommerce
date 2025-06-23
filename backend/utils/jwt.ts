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

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
