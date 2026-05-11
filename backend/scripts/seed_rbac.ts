
import { db } from "../src/config/db.js";
import { roles, permissions, rolePermissions } from "../src/models/schema.js";
import { eq, and } from "drizzle-orm";
import { UserRole } from "../src/constants/roles.js";

const seed = async () => {
    console.log("Seeding RBAC...");

    // 1. Create Default Roles
    const defaultRoles = [
        { name: UserRole.SUPER_ADMIN, description: "Full access to everything" },
        { name: UserRole.ADMIN, description: "Access to most admin features" },
        { name: UserRole.VENDOR, description: "Can manage own products and orders" },
        { name: UserRole.RESELLER, description: "Can view network and sales" },
        { name: UserRole.WHOLESALE, description: "B2B Wholesale Customer" },
        { name: UserRole.DELIVERY_PARTNER, description: "Delivery Partner" },
        { name: UserRole.ACCOUNT_MANAGER, description: "Account Manager for B2B" },
        { name: UserRole.CUSTOMER, description: "Regular customer" }
    ];

    for (const role of defaultRoles) {
        const existing = await db.select().from(roles).where(eq(roles.name, role.name));
        if (existing.length === 0) {
            await db.insert(roles).values(role);
            console.log(`Created role: ${role.name}`);
        }
    }

    // 2. Create Default Permissions
    const defaultPermissions = [
        { name: "View Dashboard", key: "view_dashboard", description: "Can view admin dashboard" },
        { name: "Manage Users", key: "manage_users", description: "Can create, edit, delete users" },
        { name: "Manage Products", key: "manage_products", description: "Can create, edit, delete products" },
        { name: "Manage Orders", key: "manage_orders", description: "Can manage orders" },
        { name: "Manage Roles", key: "manage_roles", description: "Can manage roles and permissions" },
        { name: "View Reports", key: "view_reports", description: "Can view analytics and reports" },
        { name: "Manage Content", key: "manage_content", description: "Can manage site content (banners, blogs, etc.)" },
        { name: "Manage Settings", key: "manage_settings", description: "Can manage site settings" },
        { name: "View Network", key: "view_network", description: "Can view reseller network and sales" },
        { name: "Wholesale Order", key: "wholesale_order", description: "Can place wholesale orders" },
        { name: "Manage Deliveries", key: "manage_deliveries", description: "Can view and update deliveries" },
        { name: "Manage Accounts", key: "manage_accounts", description: "Can manage B2B accounts" }, // For Account Manager
        { name: "Credit Approval", key: "credit_approval", description: "Can approve credit for B2B" }, // For Account Manager
        { name: "Withdraw Wallet", key: "withdraw_wallet", description: "Can withdraw from wallet" },
    ];

    for (const perm of defaultPermissions) {
        const existing = await db.select().from(permissions).where(eq(permissions.key, perm.key));
        if (existing.length === 0) {
            await db.insert(permissions).values(perm);
            console.log(`Created permission: ${perm.name}`);
        }
    }

    // Helper to assign permissions to a role
    const assignPermissionsToRole = async (roleName: string, permissionKeys: string[]) => {
        const role = (await db.select().from(roles).where(eq(roles.name, roleName)))[0];
        if (!role) return;

        // NEW: Clear existing permissions for this role to avoid duplicates/accumulation
        await db.delete(rolePermissions).where(eq(rolePermissions.roleId, role.id));
        console.log(`Cleared existing permissions for role: ${roleName}`);

        for (const key of permissionKeys) {
            const perm = (await db.select().from(permissions).where(eq(permissions.key, key)))[0];
            if (perm) {
                await db.insert(rolePermissions).values({
                    roleId: role.id,
                    permissionId: perm.id
                });
            }
        }
    };

    // 3. Assign Permissions to Roles

    // Super Admin: All Permissions
    const superadminRole = (await db.select().from(roles).where(eq(roles.name, UserRole.SUPER_ADMIN)))[0];
    const allPermissions = await db.select().from(permissions);
    if (superadminRole) {
        // Clear first
        await db.delete(rolePermissions).where(eq(rolePermissions.roleId, superadminRole.id));
        
        for (const perm of allPermissions) {
            await db.insert(rolePermissions).values({
                roleId: superadminRole.id,
                permissionId: perm.id
            });
        }
        console.log("Assigned all permissions to Superadmin");
    }

    // Admin: Most permissions
    await assignPermissionsToRole(UserRole.ADMIN, [
        "view_dashboard", "manage_users", "manage_products", "manage_orders", 
        "view_reports", "manage_content", "manage_deliveries", "manage_accounts"
    ]);
    console.log("Assigned permissions to Admin");

    // Vendor: Product & Order Management (Limited)
    await assignPermissionsToRole(UserRole.VENDOR, [
        "view_dashboard", "manage_products", "manage_orders"
    ]);
    console.log("Assigned permissions to Vendor");

    // Reseller: View Network, Withdraw Wallet
    await assignPermissionsToRole(UserRole.RESELLER, [
        "view_dashboard", "view_network", "withdraw_wallet"
    ]);
    console.log("Assigned permissions to Reseller");

    // Wholesale Customer: Wholesale Order
    await assignPermissionsToRole(UserRole.WHOLESALE, [
        "view_dashboard", "wholesale_order"
    ]);
    console.log("Assigned permissions to Wholesale Customer");

    // Delivery Partner: Manage Deliveries
    await assignPermissionsToRole(UserRole.DELIVERY_PARTNER, [
        "view_dashboard", "manage_deliveries"
    ]);
    console.log("Assigned permissions to Delivery Partner");

    // Account Manager: Manage Accounts, Credit Approval
    await assignPermissionsToRole(UserRole.ACCOUNT_MANAGER, [
        "view_dashboard", "manage_accounts", "credit_approval", "manage_orders"
    ]);
    console.log("Assigned permissions to Account Manager");

    console.log("RBAC Seeding Complete!");
    process.exit(0);
};



seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
