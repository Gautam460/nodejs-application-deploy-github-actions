import { Router } from "express";
import { AiController } from "../controllers/ai.controller.js";

const router = Router();
const aiController = new AiController();

router.post("/ai/chat", aiController.chat.bind(aiController));

export default router;

