import { Router } from "express";
import type { Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Dev-only: return decoded token/user info for current request
router.get("/debug/token", authenticate, (req: Request, res: Response) => {
  try {
    return res.json({ user: req.user || null });
  } catch (err) {
    return res.status(500).json({ error: "Failed to read token" });
  }
});

export default router;

