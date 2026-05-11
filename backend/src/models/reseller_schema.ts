
import { mysqlTable, serial, varchar, decimal, int, timestamp } from "drizzle-orm/mysql-core";

// To track who referred whom
export const resellerNetwork = mysqlTable("reseller_network", {
  id: serial("id").primaryKey(),
  uplinkId: int("uplink_id").notNull(), // The Reseller (User ID)
  downlinkId: int("downlink_id").notNull(), // The Customer/Sub-reseller (User ID)
  createdAt: timestamp("created_at").defaultNow(),
});

export const commissions = mysqlTable("commissions", {
    id: serial("id").primaryKey(),
    resellerId: int("reseller_id").notNull(), // User ID
    orderId: int("order_id").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 }).default("Pending"), // Pending, Approved, Paid, Cancelled
    createdAt: timestamp("created_at").defaultNow(),
});

export const payouts = mysqlTable("payouts", {
    id: serial("id").primaryKey(),
    resellerId: int("reseller_id").notNull(), // User ID
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 }).default("Pending"), // Pending, Processed, Rejected
    method: varchar("method", { length: 50 }).default("Bank Transfer"),
    transactionReference: varchar("transaction_reference", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
});
