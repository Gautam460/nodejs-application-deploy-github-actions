
import type { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

export class DashboardController {
    async getSuperAdminStats(req: Request, res: Response) {
        try {
            const stats = await dashboardService.getSuperAdminStats();
            res.json(stats);
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            res.status(500).json({ error: "Failed to fetch dashboard stats" });
        }
    }
}
