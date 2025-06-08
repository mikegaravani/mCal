import { Request, Response, NextFunction } from "express";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const verifyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  if (password === ADMIN_PASSWORD) {
    res.status(200).json({ message: "Authorized" });
    return;
  } else {
    res.status(401).json({ message: "Incorrect password" });
    return;
  }
};
