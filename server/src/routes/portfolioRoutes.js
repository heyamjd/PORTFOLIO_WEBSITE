import { Router } from "express";
import { Portfolio } from "../models/Portfolio.js";
import { defaultPortfolio } from "../data/defaultPortfolio.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne().lean();

    if (!portfolio) {
      const created = await Portfolio.create(defaultPortfolio);
      portfolio = created.toObject();
    }

    res.json(portfolio);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const existing = await Portfolio.findOne();

    if (!existing) {
      const created = await Portfolio.create({ ...defaultPortfolio, ...req.body });
      return res.status(201).json(created);
    }

    Object.assign(existing, req.body);
    await existing.save();

    return res.json(existing);
  } catch (error) {
    return next(error);
  }
});

export default router;
