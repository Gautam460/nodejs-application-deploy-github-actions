import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { roles, permissions, rolePermissions } from "../models/schema.js";
import { eq, and } from "drizzle-orm";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const rolesData = await db.select().from(roles);
    
    // Fetch permissions for each role
    const rolesWithPermissions = await Promise.all(rolesData.map(async (role: typeof roles.$inferSelect) => {
      const perms = await db
        .select({
          id: permissions.id,
          name: permissions.name,
          key: permissions.key
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, role.id));
        
      return { ...role, permissions: perms };
    }));

    res.json(rolesWithPermissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    await db.insert(roles).values({ name, description });
    res.status(201).json({ message: "Role created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await db.update(roles).set({ name, description }).where(eq(roles.id, Number(id)));
    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Remove related permissions first
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, Number(id)));
    await db.delete(roles).where(eq(roles.id, Number(id)));
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const perms = await db.select().from(permissions);
    res.json(perms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching permissions", error });
  }
};

export const updateRolePermissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body; // Array of permission IDs
    const roleId = Number(id);

    // Delete existing permissions for this role
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

    // Insert new permissions
    if (permissionIds && permissionIds.length > 0) {
        const values = permissionIds.map((permId: number) => ({
            roleId: roleId,
            permissionId: permId
        }));
        await db.insert(rolePermissions).values(values);
    }

    res.json({ message: "Role permissions updated successfully" });
  } catch (error) {
    console.error("Error updating role permissions:", error);
    res.status(500).json({ message: "Error updating permissions", error });
  }
};
