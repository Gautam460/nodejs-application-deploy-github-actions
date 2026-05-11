
import { db } from "../src/config/db.js";
import { users } from "../src/models/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { UserRole } from "../src/constants/roles.js";

const resetPassword = async () => {
    console.log("Resetting Super Admin Password...");
    
    // Hash password "123"
    const hashedPassword = await bcrypt.hash("123", 10);
    
    // Check if user exists
    const superAdmin = await db.select().from(users).where(eq(users.email, "super@admin.com"));
    
    if (superAdmin.length > 0) {
        // Update password and ensure role is correct
        await db.update(users)
            .set({ 
                password: hashedPassword,
                role: UserRole.SUPER_ADMIN,
                name: "Super Admin"
            })
            .where(eq(users.email, "super@admin.com"));
        console.log("Super Admin password reset to '123' and role updated successfully.");
    } else {
        // User doesn't exist? Create one
        await db.insert(users).values({
            email: "super@admin.com",
            password: hashedPassword,
            name: "Super Admin",
            role: UserRole.SUPER_ADMIN
        });
        console.log("CREATED missing Super Admin user with password '123'.");
    }
    
    process.exit(0);
};

resetPassword().catch((err) => {
    console.error("Error resetting password:", err);
    process.exit(1);
});
