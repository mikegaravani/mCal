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

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      message: "Registration successfully",
      token,
      userId: savedUser._id,
    });
    return;
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

// TODO USER LOGOUT

// FETCH USER PROFILE
export const fetchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ user: res.locals.user });
  } catch (err) {
    next(err);
  }
};

// FETCH ALL USERS
export const fetchAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find();
    console.log("All users fetched");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// USER PROFILE UPDATE
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password, email } = req.body;
  const user = res.locals.user as typeof User.prototype;

  if (username != null) {
    const existingUser = (await User.findOne({
      username,
    })) as typeof User.prototype;
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      res.status(409).json({ message: "Username is already taken" });
      return;
    }
    user.username = username;
  }

  if (password != null) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    } catch (hashError) {
      return next(hashError);
    }
  }

  if (email != null) {
    const existingEmail = (await User.findOne({
      email,
    })) as typeof User.prototype;
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      res.status(409).json({ message: "Email is already taken" });
      return;
    }
    user.email = email;
  }

  try {
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// USER DELETE
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = res.locals.user;

  try {
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
