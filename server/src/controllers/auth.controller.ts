import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

// USER REGISTRATION
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    res
      .status(400)
      .json({ message: "Username, password, and email are required." });
    return;
  }

  try {
    // Username in use
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(409).json({ message: "Username is already in use." });
      return;
    }

    // Email in use
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(409).json({ message: "Email is already in use." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // TODO JWT token generation

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

// USER LOGIN
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET as string
    );

    res
      .status(200)
      .json({ message: "Login successful", token, userId: user._id });
    return;
  } catch (err) {
    next(err);
  }
};
