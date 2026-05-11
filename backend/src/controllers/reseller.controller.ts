
import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { resellerNetwork as resellerNetworkTable, commissions, payouts, users, orders } from "../models/schema.js";
import { eq, desc } from "drizzle-orm";

export const getNetwork = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query; // Admin might view others, or authenticated user
    const id = Number(userId);

    const network = await db
      .select({
        id: resellerNetworkTable.id,
        downlinkId: resellerNetworkTable.downlinkId,
        name: users.name,
        email: users.email,
        joinedAt: resellerNetworkTable.createdAt
      })
      .from(resellerNetworkTable)
      .innerJoin(users, eq(resellerNetworkTable.downlinkId, users.id))
      .where(eq(resellerNetworkTable.uplinkId, id));

    res.json(network);
  } catch (error) {
    res.status(500).json({ message: "Error fetching network", error });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const id = Number(userId);

    const sales = await db
      .select({
        id: commissions.id,
        orderId: commissions.orderId,
        amount: commissions.amount,
        status: commissions.status,
        date: commissions.createdAt,
        orderTotal: orders.totalAmount,
        customerName: orders.name
      })
      .from(commissions)
      .leftJoin(orders, eq(commissions.orderId, orders.id))
      .where(eq(commissions.resellerId, id))
      .orderBy(desc(commissions.createdAt));

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

export const getPayouts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const id = Number(userId);

    const history = await db
      .select()
      .from(payouts)
      .where(eq(payouts.resellerId, id))
      .orderBy(desc(payouts.createdAt));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payouts", error });
  }
};

export const requestPayout = async (req: Request, res: Response) => {
    try {
        const { userId, amount } = req.body;
        // In real app, check balance first
        await db.insert(payouts).values({
            resellerId: Number(userId),
            amount: amount,
            status: "Pending"
        });
        res.json({ message: "Payout requested successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error requesting payout", error });
    }
};

export const generateReferralCode = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        let code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Update user
        await db.update(users)
            .set({ referralCode: code })
            .where(eq(users.id, Number(userId)));
            
        res.json({ code });
    } catch (error) {
        res.status(500).json({ message: "Error generating code", error });
    }
};
