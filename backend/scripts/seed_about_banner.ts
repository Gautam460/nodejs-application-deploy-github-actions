
import { db } from "../src/config/db";
import { banners } from "../src/models/schema";

const seedAboutBanner = async () => {
    try {
        console.log("Seeding 'About' page banner...");
        
        await db.insert(banners).values({
            title: "Our Story & Vision",
            subtitle: "Crafting Fashion Since 1990",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop", // A nice shop interior/team photo
            link: "/contact",
            position: "about",
            active: 1,
            order: 1
        });

        console.log("Successfully seeded 'About' page banner!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding banner:", error);
        process.exit(1);
    }
};

seedAboutBanner();
