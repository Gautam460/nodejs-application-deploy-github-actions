import { Router } from "express";
import { CustomOrderController } from "../controllers/customOrder.controller.js";

const router = Router();
const customOrderController = new CustomOrderController();

router.post("/custom-orders", customOrderController.createCustomOrder.bind(customOrderController));
router.get("/custom-orders", customOrderController.getCustomOrders.bind(customOrderController));
router.get("/custom-orders/:id", customOrderController.getCustomOrderById.bind(customOrderController));
router.patch("/custom-orders/:id/status", customOrderController.updateOrderStatus.bind(customOrderController));
router.delete("/custom-orders/:id", customOrderController.deleteCustomOrder.bind(customOrderController));

export default router;
