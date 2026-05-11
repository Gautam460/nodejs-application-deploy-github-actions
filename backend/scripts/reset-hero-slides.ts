import { db } from "../src/config/db.js";
import { heroSlides } from "../src/models/schema.js";

async function resetHeroSlides() {
  try {
    console.log("Deleting old slides...");
    await db.delete(heroSlides);
    
    console.log("Inserting new slides with proper images...");
    const slides = [
      {
        title: "Winter Collection 2024",
        subtitle: "Premium Jackets & Coats",
        text: "Stay warm in style with our latest range of thermal-insulated jackets. Starting from ₹1,499.",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
        buttonText: "Shop Now",
        buttonLink: "/product",
        active: 1,
        order: 1
      },
      {
        title: "Urban Streetwear",
        subtitle: "Trendy Tracksuits",
        text: "Experience ultimate comfort with our cotton-blend oversized tracksuits.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
        buttonText: "Shop Now",
        buttonLink: "/product",
        active: 1,
        order: 2
      },
      {
        title: "Activewear Essentials",
        subtitle: "High-Performance Lowers",
        text: "Stretchable, breathable, and durable lowers for your daily workout.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        buttonText: "Shop Now",
        buttonLink: "/product",
        active: 1,
        order: 3
      }
    ];

    for (const slide of slides) {
      await db.insert(heroSlides).values(slide);
    }
    
    console.log("✅ Hero slides reset successfully!");
    console.log("Total slides:", slides.length);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting hero slides:", error);
    process.exit(1);
  }
}

resetHeroSlides();
