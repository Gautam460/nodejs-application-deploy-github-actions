import { db } from "../config/db.js";
import { users } from "../models/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/auth.middleware.js";
import { UserRole } from "../constants/roles.js";

export class UserService {
    // Login with JWT token
    async login(email: string, password?: string) {
        const foundUsers = await db.select().from(users).where(eq(users.email, email));
        const user = foundUsers[0];
        
        if (!user) return null;

        if (!password) return null;
        
        // In production, verify password hash
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;
        
        // Generate JWT token
        const token = generateToken(user);
        
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        };
    }
    
    // Register new user
    async register(email: string, password: string, name: string, role: string = 'customer') {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await db.insert(users).values({
            email,
            password: hashedPassword,
            name,
            role
        });
        
        return newUser;
    }
    
    // Seed different roles
    async seedUsers() {
        const hashedPassword = await bcrypt.hash("123", 10);
        const roles = [
            { name: "Super Admin", email: "super@admin.com", password: hashedPassword, role: UserRole.SUPER_ADMIN },
            { name: "Admin User", email: "admin@admin.com", password: hashedPassword, role: UserRole.ADMIN },
            { name: "Vendor User", email: "vendor@vendor.com", password: hashedPassword, role: UserRole.VENDOR },
            { name: "Reseller User", email: "reseller@reseller.com", password: hashedPassword, role: UserRole.RESELLER },
            { name: "Wholesale Demo", email: "wholesale@wholesale.com", password: hashedPassword, role: UserRole.WHOLESALE },
            { name: "Delivery Demo", email: "delivery@delivery.com", password: hashedPassword, role: UserRole.DELIVERY_PARTNER },
            { name: "Account Manager Demo", email: "account@account.com", password: hashedPassword, role: UserRole.ACCOUNT_MANAGER },
            { name: "Customer User", email: "customer@gmail.com", password: hashedPassword, role: UserRole.CUSTOMER },
        ];

        let added = 0;
        for (const u of roles) {
            const check = await db.select().from(users).where(eq(users.email, u.email));
            if (check.length === 0) {
                await db.insert(users).values(u);
                added++;
            }
        }
        return { message: `Seeding complete. Added ${added} new users.` };
    }

    // Get all users
    async getAllUsers() {
        return await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt
        }).from(users);
    }

    // Update user role/data
    async updateUser(id: number, data: Partial<typeof users.$inferSelect>) {
        await db.update(users).set(data).where(eq(users.id, id));
        return { message: "User updated successfully" };
    }

    // Delete user
    async deleteUser(id: number) {
        await db.delete(users).where(eq(users.id, id));
        return { message: "User deleted successfully" };
    }
}
