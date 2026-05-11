import type { Request, Response } from "express";
import { GeneralService } from "../services/general.service.js";

const generalService = new GeneralService();

export class GeneralController {
    async submitContact(req: Request, res: Response) {
        try {
            const result = await generalService.createContactMessage(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to send message" });
        }
    }

    async getBlogPosts(req: Request, res: Response) {
        try {
            const posts = await generalService.getAllPosts();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch posts" });
        }
    }

    async seedBlog(req: Request, res: Response) {
        try {
            const result = await generalService.seedPosts();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to seed posts" });
        }
    }
}
