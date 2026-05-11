
import { db } from "../src/config/db.js";
import { roles, permissions, rolePermissions } from "../src/models/schema.js";
import { eq, and } from "drizzle-orm";

async function fixResellerPermissions() {
  console.log("Fixing Reseller Permissions...");

  try {
    // 1. Ensure Reseller Role Exists
    const [resellerRole] = await db.select().from(roles).where(eq(roles.name, "reseller"));
    let resellerId;

    if (!resellerRole) {
      console.log("Creating reseller role...");
      const [result] = await db.insert(roles).values({
        name: "reseller",
        description: "Can manage their own network and sales"
      });
      resellerId = result.insertId;
    } else {
      resellerId = resellerRole.id;
    }
    
    // 2. Ensure view_network permission exists
    const [perm] = await db.select().from(permissions).where(eq(permissions.key, "view_network"));
    let permId;

    if (!perm) {
        console.log("Creating view_network permission...");
        const [result] = await db.insert(permissions).values({
            name: "View Network",
            key: "view_network",
            description: "View reseller network and sales"
        });
        permId = result.insertId;
    } else {
        permId = perm.id;
    }

    // 3. Link them
    const [existingLink] = await db.select().from(rolePermissions).where(
        and(
            eq(rolePermissions.roleId, resellerId),
            eq(rolePermissions.permissionId, permId)
        )
    );

    if (!existingLink) {
        console.log("Linking reseller to view_network...");
        await db.insert(rolePermissions).values({
            roleId: resellerId,
            permissionId: permId
        });
    } else {
        console.log("Reseller already has view_network permission.");
    }
    
    console.log("Permissions fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing permissions:", error);
    process.exit(1);
  }
}

fixResellerPermissions();
