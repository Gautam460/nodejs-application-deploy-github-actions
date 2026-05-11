import { Router } from "express";
import { DynamicPagesController } from "../controllers/dynamicPages.controller.js";

const router = Router();
const dynamicPagesController = new DynamicPagesController();

// Cart custom fields
router.get("/cart/custom-fields", dynamicPagesController.getCartCustomFields.bind(dynamicPagesController));

// Returns & Refunds
router.get("/returns/policies", dynamicPagesController.getReturnsPolicies.bind(dynamicPagesController));
router.post("/returns/request", dynamicPagesController.submitReturnRequest.bind(dynamicPagesController));
router.get("/returns/requests", dynamicPagesController.getReturnRequests.bind(dynamicPagesController));

// AI Features
router.get("/ai/features", dynamicPagesController.getAiFeatures.bind(dynamicPagesController));
router.get("/ai/faqs", dynamicPagesController.getAiFaqs.bind(dynamicPagesController));

// Seed
router.get("/dynamic-pages/seed", dynamicPagesController.seedDynamicPages.bind(dynamicPagesController));

export default router;
