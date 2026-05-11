import type { Request, Response } from "express";
import { callOpenRouterChat, type ChatMessage } from "../services/ai.service.js";
import { logger } from "../utils/logger.js";

type AiChatBody = {
  message?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  language?: string;
};

export class AiController {
  async chat(req: Request, res: Response) {
    const body = (req.body || {}) as AiChatBody;
    const message = (body.message || "").trim();

    if (!message) {
      return res.status(400).json({ success: false, error: "message is required" });
    }

    const system: ChatMessage = {
      role: "system",
      content:
        body.language === "hi"
          ? "آپ ایک مددگار AI اسسٹنٹ ہیں۔ جوابات مختصر اور واضح دیں۔"
          : "You are a helpful AI assistant. Be concise and clear.",
    };

    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content.trim()
          )
          .slice(-20)
          .map((m) => ({ role: m.role, content: m.content }))
      : [];

    const messages: ChatMessage[] = [
      system,
      ...history,
      { role: "user", content: message },
    ];

    try {
      const result = await callOpenRouterChat(messages);
      return res.json(result);
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "AI request failed";
      logger.error(`[AiController] Chat error: ${errorMsg}`);
      return res.status(500).json({ success: false, error: errorMsg });
    }
  }
}
