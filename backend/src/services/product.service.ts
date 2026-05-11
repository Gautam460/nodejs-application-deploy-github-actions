import { db } from "../config/db.js";
import { products } from "../models/schema.js";
import { eq } from "drizzle-orm";

export class ProductService {
  async getAllProducts() {
    return await db.select().from(products);
  }

  async getProductById(id: number) {
    const product = await db.select().from(products).where(eq(products.id, id));
    return product[0];
  }

  async getProductsByCategory(category: string) {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async seedProducts() {
    const count = await db.select().from(products);
    if (count.length > 0) return { message: "Database already seeded" };

    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();

    for (const item of data as any[]) {
      await db.insert(products).values({
        title: item.title,
        price: item.price.toString(),
        description: item.description,
        category: item.category,
        image: item.image,
        ratingRate: item.rating.rate.toString(),
        ratingCount: item.rating.count,
      });
    }
    return { message: "Database seeded successfully" };
  }

  async createProduct(data: any) {
    const result = await db.insert(products).values({
      title: data.title,
      price: data.price.toString(),
      description: data.description || '',
      category: data.category || '',
      image: data.image || '',
      ratingRate: data.ratingRate?.toString() || '0',
      ratingCount: data.ratingCount || 0,
    });
    return result;
  }

  async updateProduct(id: number, data: any) {
    await db.update(products).set({
      title: data.title,
      price: data.price.toString(),
      description: data.description,
      category: data.category,
      image: data.image,
      ratingRate: data.ratingRate?.toString(),
      ratingCount: data.ratingCount,
    }).where(eq(products.id, id));
  }

  async deleteProduct(id: number) {
    await db.delete(products).where(eq(products.id, id));
  }
}
