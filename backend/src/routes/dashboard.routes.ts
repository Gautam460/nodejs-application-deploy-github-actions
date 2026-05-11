
import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate, isSuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
const dashboardController = new DashboardController();

router.get("/dashboard/superadmin-stats", authenticate, isSuperAdmin, dashboardController.getSuperAdminStats.bind(dashboardController));

export default router;
