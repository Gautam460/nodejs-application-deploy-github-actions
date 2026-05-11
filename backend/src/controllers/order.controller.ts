import type { Request, Response } from "express";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const result = await orderService.createOrder(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const { email } = req.query;
      if (email) {
          const orders = await orderService.getOrdersByEmail(email as string);
          return res.json(orders);
      }
      // If no email, return all (admin view or dev testing)
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await orderService.deleteOrder(Number(id));
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete order" });
    }
  }
}
