
import { db } from "../config/db.js";
import { users, orders, returnRequests, canceledOrders } from "../models/schema.js";
import { eq, sql } from "drizzle-orm";
import { UserRole } from "../constants/roles.js";

export class DashboardService {
    async getSuperAdminStats() {
        // 1. Total Sales (B2C vs B2B)
        const orderStats = await db.select({
            orderType: orders.orderType,
            totalAmount: sql<number>`SUM(CAST(${orders.totalAmount} AS DECIMAL(10,2)))`,
            count: sql<number>`COUNT(*)`
        }).from(orders).groupBy(orders.orderType);

        let b2cSales = 0;
        let b2bSales = 0;
        orderStats.forEach(stat => {
            if (stat.orderType === 'retail') b2cSales = Number(stat.totalAmount || 0);
            if (stat.orderType === 'wholesale') b2bSales = Number(stat.totalAmount || 0);
        });

        // 2. Total Vendors
        const vendors = await db.select({ count: sql<number>`COUNT(*)` })
            .from(users)
            .where(eq(users.role, UserRole.VENDOR));
        const totalVendors = vendors[0]?.count || 0;

        // 3. Total Customers
        const customers = await db.select({ count: sql<number>`COUNT(*)` })
            .from(users)
            .where(sql`${users.role} IN ('customer', 'user')`);
        const totalCustomers = customers[0]?.count || 0;

        // 4. Pending Payments
        // Assuming status 'Processing' or 'Pending' means payment pending or awaiting fulfillment
        const pending = await db.select({ total: sql<number>`SUM(CAST(${orders.totalAmount} AS DECIMAL(10,2)))` })
            .from(orders)
            .where(eq(orders.status, 'Processing'));
        const pendingPayments = Number(pending[0]?.total || 0);

        // 5. Refund Requests
        const refunds = await db.select({ count: sql<number>`COUNT(*)` })
            .from(returnRequests)
            .where(eq(returnRequests.status, 'Pending'));
        const refundRequestsCount = refunds[0]?.count || 0;

        // 6. Graph Analytics (Last 6 Months Sales)
        // This is a bit more complex with Drizzle/MySQL, let's just do a simple month-wise group
        const monthlySales = await db.select({
            month: sql<string>`DATE_FORMAT(${orders.createdAt}, '%Y-%m')`,
            type: orders.orderType,
            total: sql<number>`SUM(CAST(${orders.totalAmount} AS DECIMAL(10,2)))`
        }).from(orders)
        .groupBy(sql`DATE_FORMAT(${orders.createdAt}, '%Y-%m')`, orders.orderType)
        .orderBy(sql`DATE_FORMAT(${orders.createdAt}, '%Y-%m')`);

        return {
            b2cSales,
            b2bSales,
            totalVendors,
            totalCustomers,
            pendingPayments,
            refundRequestsCount,
            monthlySales
        };
    }
}
