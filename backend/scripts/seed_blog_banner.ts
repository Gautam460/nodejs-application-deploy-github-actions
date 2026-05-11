
import { db } from "../src/config/db";
import { banners } from "../src/models/schema";

const seedBlogBanner = async () => {
    try {
        console.log("Seeding 'Blog' page banner...");
        
        await db.insert(banners).values({
            title: "The Journal",
            subtitle: "Stories of Style & Substance",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop", // Fashion editorial style image
            link: "/blog",
            position: "blog",
            active: 1,
            order: 1
        });

        console.log("Successfully seeded 'Blog' page banner!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding banner:", error);
        process.exit(1);
    }
};

seedBlogBanner();
