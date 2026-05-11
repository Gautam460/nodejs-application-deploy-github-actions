import { db } from "../config/db.js";
import { heroSlides } from "../models/schema.js";
import { eq } from "drizzle-orm";

export class HeroService {
  async getActiveSlides() {
    return await db.select().from(heroSlides).where(eq(heroSlides.active, 1));
  }

  async seedSlides() {
      const count = await db.select().from(heroSlides);
      if (count.length > 0) return { message: "Slides already seeded" };

      const slides = [
          {
              title: "Trendsetting Styles",
              subtitle: "New Arrivals",
              text: "Explore the latest in fashion with our exclusive collection.",
              image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1500&auto=format&fit=crop"
          },
          {
              title: "Elegant & Exclusive",
              subtitle: "Summer Collection",
              text: "Define your style with our premium range of clothing.",
              image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1500&auto=format&fit=crop"
          },
          {
              title: "Urban Minimalist",
              subtitle: "Best Sellers",
              text: "Sophisticated designs for the modern individual.",
              image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1500&auto=format&fit=crop"
          }
      ];

      for (const slide of slides) {
          await db.insert(heroSlides).values(slide);
      }
      return { message: "Slides seeded successfully" };
  }

  async createSlide(data: any) {
    const result = await db.insert(heroSlides).values({
      title: data.title,
      subtitle: data.subtitle,
      text: data.description || '',
      image: data.image,
      buttonText: data.buttonText || '',
      buttonLink: data.buttonLink || '',
      order: data.order || 0,
      active: data.active || 1
    });
    return result;
  }

  async updateSlide(id: number, data: any) {
    await db.update(heroSlides).set({
      title: data.title,
      subtitle: data.subtitle,
      text: data.description,
      image: data.image,
      buttonText: data.buttonText,
      buttonLink: data.buttonLink,
      order: data.order,
      active: data.active
    }).where(eq(heroSlides.id, id));
  }

  async deleteSlide(id: number) {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
  }
}
