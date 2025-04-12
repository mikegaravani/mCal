import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User from "../models/user.model";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      username: string;
    };

    // Optionally, fetch user from DB and attach to res.locals
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
    } else if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      next(err);
    }
  }
};
