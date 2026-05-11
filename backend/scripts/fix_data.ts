import { db } from "../src/config/db.js";
import { banners, announcements } from "../src/models/schema.js";

async function main() {
    console.log("Fixing data...");

    try {
        // 1. Fix Banners
        await db.delete(banners);
        await db.insert(banners).values([
            {
                title: "Summer Sale",
                subtitle: "Up to 50% Off",
                image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
                link: "/product?sale=true",
                position: "home",
                active: 1,
                order: 1
            }
        ]);
        console.log("Banners reset.");

        // 2. Fix Announcements (Top Banner)
        await db.delete(announcements);
        await db.insert(announcements).values([
            {
                message: "Free Shipping on Orders Over $50! Shop Now.",
                link: "/product",
                backgroundColor: "#000000",
                textColor: "#ffffff",
                active: 1
            }
        ]);
        console.log("Announcements reset.");

    } catch (e) {
        console.error("Error:", e);
    }

    process.exit(0);
}

main();
