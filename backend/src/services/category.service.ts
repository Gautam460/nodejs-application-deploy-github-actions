import { db } from "../config/db.js";
import { categories } from "../models/schema.js";
import { eq } from "drizzle-orm";

export class CategoryService {
  async getActiveCategories() {
    return await db.select().from(categories).where(eq(categories.active, 1));
  }

  async getAllCategories() {
    return await db.select().from(categories);
  }

  async createCategory(data: any) {
    // Basic validation
    if (!data.name || !data.slug) {
      throw new Error("ValidationError: 'name' and 'slug' are required");
    }

    // Check uniqueness of slug
    const existing = await db.select().from(categories).where(eq(categories.slug, data.slug));
    if (existing.length > 0) {
      throw new Error("ConflictError: slug already exists");
    }

    const result = await db.insert(categories).values({
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      parentId: data.parentId || 0,
      image: data.image || null,
      order: data.order || 0,
      active: data.active || 1,
    });
    return result;
  }

  async updateCategory(id: number, data: any) {
    await db.update(categories).set({
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId || 0,
      image: data.image,
      order: data.order,
      active: data.active,
    }).where(eq(categories.id, id));
  }

  async deleteCategory(id: number) {
    // Prevent deletion if child categories exist
    const children = await db.select().from(categories).where(eq(categories.parentId, id));
    if (children.length > 0) {
      throw new Error("Category has child categories. Remove or reassign them before deleting.");
    }
    await db.delete(categories).where(eq(categories.id, id));
  }
}

