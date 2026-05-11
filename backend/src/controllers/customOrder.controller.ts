import type { Request, Response } from "express";
import { CustomOrderService } from "../services/customOrder.service.js";

const customOrderService = new CustomOrderService();

export class CustomOrderController {
    async createCustomOrder(req: Request, res: Response) {
        try {
            const result = await customOrderService.createCustomOrder(req.body);
            res.json({ message: "Custom order created successfully", orderId: result });
        } catch (error) {
            console.error("Create custom order error:", error);
            res.status(500).json({ error: "Failed to create custom order" });
        }
    }

    async getCustomOrders(req: Request, res: Response) {
        try {
            const orders = await customOrderService.getCustomOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch custom orders" });
        }
    }

    async getCustomOrderById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const order = await customOrderService.getCustomOrderById(id);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch order" });
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
            await customOrderService.updateCustomOrderStatus(id, status);
            res.json({ message: "Order status updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to update order status" });
        }
    }

    async deleteCustomOrder(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await customOrderService.deleteCustomOrder(id);
            res.json({ message: "Custom order deleted successfully" });
        } catch (error) {
            console.error("Delete custom order error:", error);
            res.status(500).json({ error: "Failed to delete custom order" });
        }
    }
}
