import { db } from "../src/config/db.js";
import { featuredCategories } from "../src/models/schema.js";

async function seedFeaturedCategories() {
  try {
    console.log("Deleting old featured categories...");
    await db.delete(featuredCategories);
    
    console.log("Inserting new featured categories...");
    const categories = [
      {
        name: "Mens Jackets",
        slug: "mens-jackets",
        description: "New Arrivals",
        image: "https://images.unsplash.com/photo-1551028919-ac66e6a46121?q=80&w=1000&auto=format&fit=crop",
        active: 1,
        order: 1
      },
      {
        name: "Tracksuits",
        slug: "tracksuits",
        description: "Best Selling",
        image: "https://images.unsplash.com/photo-1620249429452-921c3858eb5b?q=80&w=1000&auto=format&fit=crop",
        active: 1,
        order: 2
      },
      {
        name: "Casual Lowers",
        slug: "casual-lowers",
        description: "Trending",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop",
        active: 1,
        order: 3
      }
    ];

    for (const cat of categories) {
      await db.insert(featuredCategories).values(cat);
    }
    
    console.log("✅ Featured categories seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding featured categories:", error);
    process.exit(1);
  }
}

seedFeaturedCategories();
