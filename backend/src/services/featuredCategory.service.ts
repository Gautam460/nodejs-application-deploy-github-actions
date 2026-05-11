import { db } from "../config/db.js";
import { featuredCategories } from "../models/schema.js";
import { eq } from "drizzle-orm";

export class FeaturedCategoryService {
  async getActiveCategories() {
    return await db.select().from(featuredCategories).where(eq(featuredCategories.active, 1));
  }

  async getAllCategories() {
    return await db.select().from(featuredCategories);
  }

  async createCategory(data: any) {
    const result = await db.insert(featuredCategories).values({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      image: data.image,
      order: data.order || 0,
      active: data.active || 1
    });
    return result;
  }

  async updateCategory(id: number, data: any) {
    await db.update(featuredCategories).set({
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      order: data.order,
      active: data.active
    }).where(eq(featuredCategories.id, id));
  }

  async deleteCategory(id: number) {
    await db.delete(featuredCategories).where(eq(featuredCategories.id, id));
  }
}
