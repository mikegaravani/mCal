import { RequestHandler } from "express";
import { timeMachineService } from "../services/timeMachineService";

export const getCurrentTime: RequestHandler = (req, res) => {
  const now = timeMachineService.getNow();
  res.json({ now });
};

export const setCustomTime: RequestHandler = (req, res) => {
  const { customTime } = req.body;
  if (!customTime) {
    res.status(400).json({ error: "customTime is required" });
    return;
  }
  timeMachineService.setCustomTime(new Date(customTime));
  res.status(200).json({ success: true });
};

export const resetTime: RequestHandler = (req, res) => {
  timeMachineService.resetTime();
  res.status(200).json({ success: true });
};
