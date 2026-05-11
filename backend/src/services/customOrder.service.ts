import { db } from "../config/db.js";
import { customOrders } from "../models/schema.js";
import { eq } from "drizzle-orm";

export class CustomOrderService {
    async createCustomOrder(data: any) {
        const result = await db.insert(customOrders).values({
            userId: data.userId || null,
            userEmail: data.userEmail,
            productType: data.productType,
            designPattern: data.designPattern,
            fit: data.fit,
            mainColor: data.mainColor,
            accentColor: data.accentColor,
            zipperColor: data.zipperColor,
            hasHood: data.hasHood ? 1 : 0,
            hasZipper: data.hasZipper ? 1 : 0,
            logoVisible: data.logoVisible ? 1 : 0,
            measurements: JSON.stringify(data.measurements),
            customNotes: data.customNotes || null,
            totalPrice: data.totalPrice || 0,
            designImage: data.designImage || null, // Add this field
            status: 'Pending'
        });
        return result;
    }

    async getCustomOrders() {
        return await db.select().from(customOrders).orderBy(customOrders.createdAt);
    }

    async getCustomOrderById(id: number) {
        // Fix: Use eq() here as well if the previous code was indeed broken or just use it for safety
        const result = await db.select().from(customOrders).where(eq(customOrders.id, id));
        return result[0] || null;
    }

    async updateCustomOrderStatus(id: number, status: string) {
        return await db.update(customOrders).set({ status }).where(eq(customOrders.id, id));
    }

    async deleteCustomOrder(id: number) {
        return await db.delete(customOrders).where(eq(customOrders.id, id));
    }
}
