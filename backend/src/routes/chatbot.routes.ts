import { Router } from "express";
import { ChatbotController } from "../controllers/chatbot.controller.js";

const router = Router();
const chatbot = new ChatbotController();

// Public — frontend gets active FAQs and matches questions
router.get("/chatbot/faqs/active", chatbot.getActive.bind(chatbot));
router.post("/chatbot/match", chatbot.match.bind(chatbot));

// Admin CRUD
router.get("/chatbot/faqs", chatbot.getAll.bind(chatbot));
router.post("/chatbot/faqs", chatbot.create.bind(chatbot));
router.put("/chatbot/faqs/:id", chatbot.update.bind(chatbot));
router.delete("/chatbot/faqs/:id", chatbot.delete.bind(chatbot));

export default router;
