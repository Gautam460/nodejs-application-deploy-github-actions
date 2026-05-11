import { db } from "../config/db.js";
import { contactMessages, blogPosts } from "../models/schema.js";
import { desc } from "drizzle-orm";

export class GeneralService {
    // Contact Logic
    async createContactMessage(data: { name: string; email: string; message: string }) {
        await db.insert(contactMessages).values(data);
        return { message: "Message sent successfully" };
    }

    // Blog Logic
    async getAllPosts() {
        return await db.select().from(blogPosts).orderBy(desc(blogPosts.date));
    }

    async seedPosts() {
        const count = await db.select().from(blogPosts);
        if (count.length > 0) return { message: "Posts already seeded" };

        const posts = [
            {
                title: "The Art of Layering: A Winter Guide",
                excerpt: "Master the season's most essential skill with our comprehensive guide to layering textures and tones.",
                content: "Full article content goes here...",
                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
                category: "Style Guide"
            },
            {
                title: "Sustainable Luxury: The Future of Fashion",
                excerpt: "Exploring how premium brands are embracing eco-conscious materials without compromising on elegance.",
                content: "Full article content goes here...",
                image: "https://images.unsplash.com/photo-1581044777550-64261156da92?q=80&w=800&auto=format&fit=crop",
                category: "Sustainability"
            },
            {
                title: "Accessories That Define a Look",
                excerpt: "From statement jewelry to classic timepieces, discover the finishing touches that elevate any outfit.",
                content: "Full article content goes here...",
                image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
                category: "Trends"
            }
        ];

        for (const post of posts) {
            await db.insert(blogPosts).values(post);
        }
        return { message: "Posts seeded successfully" };
    }
}
