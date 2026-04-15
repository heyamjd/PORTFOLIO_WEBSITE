import { Router } from "express";
import { ContactMessage } from "../models/ContactMessage.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }

    const saved = await ContactMessage.create({ name, email, message });
    return res.status(201).json({ message: "Message saved successfully", id: saved._id });
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

export default router;
