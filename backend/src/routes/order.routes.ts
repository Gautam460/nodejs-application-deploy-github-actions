import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";

const router = Router();
const orderController = new OrderController();

router.post("/orders", orderController.createOrder.bind(orderController));
router.get("/orders", orderController.getOrders.bind(orderController));
router.delete("/orders/:id", orderController.deleteOrder.bind(orderController));

export default router;
