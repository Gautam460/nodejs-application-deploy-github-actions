import type { Request, Response } from "express";
import { DynamicPagesService } from "../services/dynamicPages.service.js";

const dynamicPagesService = new DynamicPagesService();

export class DynamicPagesController {
    async getCartCustomFields(req: Request, res: Response) {
        try {
            const fields = await dynamicPagesService.getCartCustomFields();
            res.json(fields);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch custom fields" });
        }
    }

    async getReturnsPolicies(req: Request, res: Response) {
        try {
            const policies = await dynamicPagesService.getReturnsPolicies();
            res.json(policies);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch returns policies" });
        }
    }

    async submitReturnRequest(req: Request, res: Response) {
        try {
            const result = await dynamicPagesService.submitReturnRequest(req.body);
            res.json({ message: "Return request submitted successfully", id: result });
        } catch (error) {
            res.status(500).json({ error: "Failed to submit return request" });
        }
    }

    async getReturnRequests(req: Request, res: Response) {
        try {
            const requests = await dynamicPagesService.getReturnRequests();
            res.json(requests);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch return requests" });
        }
    }

    async getAiFeatures(req: Request, res: Response) {
        try {
            const features = await dynamicPagesService.getAiFeatures();
            res.json(features);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch AI features" });
        }
    }

    async getAiFaqs(req: Request, res: Response) {
        try {
            const category = req.query.category as string;
            const faqs = await dynamicPagesService.getAiFaqs(category);
            res.json(faqs);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch FAQs" });
        }
    }

    async seedDynamicPages(req: Request, res: Response) {
        try {
            const result = await dynamicPagesService.seedDynamicPages();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Seeding failed" });
        }
    }
}
