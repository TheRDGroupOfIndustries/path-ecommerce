import { Request, Response, NextFunction, RequestHandler } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    username?: string;
    role?: string;
  };
}


export const authorizeRole = (role: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ msg: "Forbidden - Access denied" });
      return; // ✅ Ensure early return
    }

    next(); // ✅ Pass to next middleware if role matches
  };
};
