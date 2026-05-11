// Example of how to use middleware in routes

import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authenticate, isAnyUser, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
const orderController = new OrderController();

// Public route - no authentication needed
router.post("/orders", orderController.createOrder.bind(orderController));

// Protected routes - require authentication
router.get("/orders", authenticate, isAnyUser, orderController.getOrders.bind(orderController));

// Admin only route example
// router.delete("/orders/:id", authenticate, isAdmin, orderController.deleteOrder.bind(orderController));

export default router;
