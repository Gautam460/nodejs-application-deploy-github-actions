import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { chatbotFaqs } from "../models/schema.js";
import { eq } from "drizzle-orm";

export class ChatbotController {
  // GET all FAQ entries
  async getAll(req: Request, res: Response) {
    try {
      const rows = await db.select().from(chatbotFaqs).orderBy(chatbotFaqs.order);
      res.json({ data: rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET active FAQ entries (for frontend suggestions)
  async getActive(req: Request, res: Response) {
    try {
      const rows = await db
        .select()
        .from(chatbotFaqs)
        .where(eq(chatbotFaqs.active, 1))
        .orderBy(chatbotFaqs.order);
      res.json({ data: rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST create
  async create(req: Request, res: Response) {
    try {
      const { question, keywords, answer, category, order, active } = req.body;
      if (!question || !keywords || !answer) {
        return res.status(400).json({ error: "question, keywords, and answer are required" });
      }
      const [result] = await db.insert(chatbotFaqs).values({
        question,
        keywords,
        answer,
        category: category || "General",
        order: order ?? 0,
        active: active ?? 1,
      });
      res.json({ success: true, id: (result as any).insertId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // PUT update
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const body = req.body as {
        question?: string;
        keywords?: string;
        answer?: string;
        category?: string;
        order?: number;
        active?: number;
      };
      const updateData: Record<string, string | number | undefined> = {};
      if (body.question !== undefined) updateData.question = body.question;
      if (body.keywords !== undefined) updateData.keywords = body.keywords;
      if (body.answer !== undefined) updateData.answer = body.answer;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.order !== undefined) updateData.order = body.order;
      if (body.active !== undefined) updateData.active = body.active;

      await db
        .update(chatbotFaqs)
        .set(updateData)
        .where(eq(chatbotFaqs.id, id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // DELETE
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await db.delete(chatbotFaqs).where(eq(chatbotFaqs.id, id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /chatbot/match — fuzzy keyword match
  async match(req: Request, res: Response) {
    try {
      const { message } = req.body as { message?: string };
      if (!message) return res.status(400).json({ error: "message is required" });

      const rows = await db
        .select()
        .from(chatbotFaqs)
        .where(eq(chatbotFaqs.active, 1));

      const userWords = message.toLowerCase().split(/\s+/).filter(Boolean);

      let bestMatch: typeof rows[0] | null = null;
      let bestScore = 0;

      for (const faq of rows) {
        const keywordList = faq.keywords
          .toLowerCase()
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);

        let score = 0;
        for (const kw of keywordList) {
          if (userWords.some((w) => w.includes(kw) || kw.includes(w))) {
            score++;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = faq;
        }
      }

      if (bestMatch && bestScore > 0) {
        return res.json({ matched: true, answer: bestMatch.answer, question: bestMatch.question });
      }

      return res.json({
        matched: false,
        answer:
          "I'm sorry, I don't have an answer for that yet. You can try switching to AI Chat mode for a full AI-powered response!",
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
