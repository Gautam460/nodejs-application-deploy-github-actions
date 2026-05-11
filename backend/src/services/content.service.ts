import { db } from "../config/db.js";
import { eq, and } from "drizzle-orm";
import { 
    siteSettings, 
    menuItems, 
    footerSections, 
    footerLinks,
    homeSections,
    featuredCategories,
    banners,
    testimonials,
    announcements,
    aboutSections,
    heroSlides,
    blogPosts,
    products
} from "../models/schema.js";

export class ContentService {
    // Get site settings
    async getSiteSettings() {
        const settings = await db.select().from(siteSettings).limit(1);
        return settings[0] || null;
    }

    // Update site settings
    async updateSiteSettings(data: any) {
        const settings = await db.select().from(siteSettings).limit(1);
        if (settings.length === 0) {
             return await db.insert(siteSettings).values(data);
        } else {
             // We update the first row
             return await db.update(siteSettings).set(data).where(eq(siteSettings.id, settings[0].id));
        }
    }

    // Get menu items
    async getMenuItems() {
        return await db.select().from(menuItems).orderBy(menuItems.order);
    }

    // Create menu item
    async createMenuItem(data: any) {
        const sanitized = {
            label: data.label,
            url: data.url,
            icon: data.icon,
            order: data.order,
            active: data.active
        };
        return await db.insert(menuItems).values(sanitized);
    }

    // Update menu item
    async updateMenuItem(id: number, data: any) {
        const sanitized = {
            label: data.label,
            url: data.url,
            icon: data.icon,
            order: data.order,
            active: data.active
        };
        return await db.update(menuItems).set(sanitized).where(eq(menuItems.id, id));
    }

    // Delete menu item
    async deleteMenuItem(id: number) {
        return await db.delete(menuItems).where(eq(menuItems.id, id));
    }

    // Get footer data
    async getFooterData() {
        const sections = await db.select().from(footerSections).where({ active: 1 }).orderBy(footerSections.order);
        const links = await db.select().from(footerLinks).where({ active: 1 }).orderBy(footerLinks.order);
        
        return {
            sections: sections.map(section => ({
                ...section,
                links: links.filter(link => link.sectionId === section.id)
            }))
        };
    }

    // Get home sections
    async getHomeSections() {
        return await db.select().from(homeSections).where({ active: 1 }).orderBy(homeSections.order);
    }

    // Get featured categories
    async getFeaturedCategories() {
        return await db.select().from(featuredCategories).where({ active: 1 }).orderBy(featuredCategories.order);
    }

    // Get active banners
    async getBanners(position = 'home') {
        const now = new Date();
        return await db.select().from(banners)
            .where(and(eq(banners.active, 1), eq(banners.position, position)))
            .orderBy(banners.order);
    }

    // Banner CRUD
    async getAllBanners() {
        return await db.select().from(banners).orderBy(banners.order);
    }

    async createBanner(data: any) {
        const sanitized = {
            title: data.title,
            subtitle: data.subtitle,
            image: data.image,
            link: data.link,
            position: data.position,
            order: data.order,
            active: data.active
        };
        return await db.insert(banners).values(sanitized);
    }

    async updateBanner(id: number, data: any) {
        const sanitized = {
            title: data.title,
            subtitle: data.subtitle,
            image: data.image,
            link: data.link,
            position: data.position,
            order: data.order,
            active: data.active
        };
        return await db.update(banners).set(sanitized).where(eq(banners.id, id));
    }

    async deleteBanner(id: number) {
        return await db.delete(banners).where(eq(banners.id, id));
    }

    // Get testimonials
    async getTestimonials() {
        return await db.select().from(testimonials).where({ active: 1 }).orderBy(testimonials.order);
    }

    // Get active announcements
    async getAnnouncements() {
        const now = new Date();
        return await db.select().from(announcements).where({ active: 1 }).limit(1);
    }

    // Get about sections
    async getAboutSections() {
        return await db.select().from(aboutSections).where({ active: 1 }).orderBy(aboutSections.order);
    }

    // Create about section
    async createAboutSection(data: any) {
        const sanitized = {
            type: data.type,
            title: data.title,
            subtitle: data.subtitle,
            content: data.content,
            image: data.image,
            order: data.order,
            active: data.active
        };
        return await db.insert(aboutSections).values(sanitized);
    }

    // Update about section
    async updateAboutSection(id: number, data: any) {
         const sanitized = {
            type: data.type,
            title: data.title,
            subtitle: data.subtitle,
            content: data.content,
            image: data.image,
            order: data.order,
            active: data.active
        };
         return await db.update(aboutSections).set(sanitized).where(eq(aboutSections.id, id));
    }

    // Delete about section
    async deleteAboutSection(id: number) {
        return await db.delete(aboutSections).where(eq(aboutSections.id, id));
    }

    // Featured Categories CRUD
    async createFeaturedCategory(data: any) {
        const sanitized = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            image: data.image,
            order: data.order,
            active: data.active
        };
        return await db.insert(featuredCategories).values(sanitized);
    }

    async updateFeaturedCategory(id: number, data: any) {
        const sanitized = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            image: data.image,
            order: data.order,
            active: data.active
        };
        return await db.update(featuredCategories).set(sanitized).where(eq(featuredCategories.id, id));
    }

    async deleteFeaturedCategory(id: number) {
        return await db.delete(featuredCategories).where(eq(featuredCategories.id, id));
    }

    // Seed initial data
    async seedContent() {
        try {
            // Seed site settings
            const settingsCheck = await db.select().from(siteSettings);
            if (settingsCheck.length === 0) {
                await db.insert(siteSettings).values({
                    siteName: "Prince Garments",
                    siteTagline: "Premium Style",
                    phone: "+91 98765 43210",
                    email: "info@princegarments.com",
                    address: "123 Fashion Street, Mumbai, India",
                    facebookUrl: "https://facebook.com/princegarments",
                    instagramUrl: "https://instagram.com/princegarments",
                    twitterUrl: "https://twitter.com/princegarments",
                    whatsappNumber: "+919876543210"
                });
            }

            // Seed menu items
            const menuCheck = await db.select().from(menuItems);
            if (menuCheck.length === 0) {
                await db.insert(menuItems).values([
                    { label: "Home", url: "/", order: 1, icon: "fa-home" },
                    { label: "Products", url: "/product", order: 2, icon: "fa-shopping-bag" },
                    { label: "Blog", url: "/blog", order: 3, icon: "fa-newspaper-o" },
                    { label: "About", url: "/about", order: 4, icon: "fa-info-circle" },
                    { label: "Contact", url: "/contact", order: 5, icon: "fa-envelope" },
                ]);
            }

            // Seed footer sections
            const footerCheck = await db.select().from(footerSections);
            if (footerCheck.length === 0) {
                const sections = await db.insert(footerSections).values([
                    { title: "Quick Links", order: 1 },
                    { title: "Customer Service", order: 2 },
                    { title: "About Us", content: "Prince Garments - Your destination for premium fashion.", order: 3 },
                ]);

                // Seed footer links
                await db.insert(footerLinks).values([
                    { sectionId: 1, label: "Shop", url: "/product", order: 1 },
                    { sectionId: 1, label: "New Arrivals", url: "/product?sort=new", order: 2 },
                    { sectionId: 1, label: "Sale", url: "/product?sale=true", order: 3 },
                    { sectionId: 2, label: "Track Order", url: "/orders", order: 1 },
                    { sectionId: 2, label: "Returns", url: "/returns", order: 2 },
                    { sectionId: 2, label: "Shipping Info", url: "/shipping", order: 3 },
                ]);
            }

            // Seed featured categories
            const catCheck = await db.select().from(featuredCategories);
            if (catCheck.length === 0) {
                await db.insert(featuredCategories).values([
                    { 
                        name: "Men's Fashion", 
                        slug: "mens-clothing", 
                        description: "Latest trends for men", 
                        image: "https://placehold.co/600x400/2c3e50/fff?text=Men's+Fashion",
                        order: 1 
                    },
                    { 
                        name: "Women's Fashion", 
                        slug: "womens-clothing", 
                        description: "Elegant styles for women", 
                        image: "https://placehold.co/600x400/e74c3c/fff?text=Women's+Fashion",
                        order: 2 
                    },
                    { 
                        name: "Accessories", 
                        slug: "accessories", 
                        description: "Complete your look", 
                        image: "https://placehold.co/600x400/3498db/fff?text=Accessories",
                        order: 3 
                    },
                ]);
            }

            // Seed testimonials
            const testCheck = await db.select().from(testimonials);
            if (testCheck.length === 0) {
                await db.insert(testimonials).values([
                    { name: "Rahul Sharma", designation: "Fashion Enthusiast", message: "Amazing quality and service! Highly recommended.", rating: 5, order: 1 },
                    { name: "Priya Patel", designation: "Regular Customer", message: "Love the collection. Always find what I'm looking for.", rating: 5, order: 2 },
                    { name: "Amit Kumar", designation: "Satisfied Buyer", message: "Great prices and fast delivery. Will shop again!", rating: 5, order: 3 },
                ]);
            }

            // Seed hero slides
            const heroCheck = await db.select().from(heroSlides);
            if (heroCheck.length === 0) {
                await db.insert(heroSlides).values([
                    {
                        title: "Summer Collection 2024",
                        subtitle: "Discover the latest trends",
                        text: "Upgrade your wardrobe with our new arrivals.",
                        image: "https://via.placeholder.com/1920x800?text=Summer+Collection",
                        buttonText: "Shop Now",
                        buttonLink: "/product",
                        order: 1,
                        active: 1
                    },
                    {
                        title: "New Arrivals",
                        subtitle: "Fresh styles just for you",
                        text: "Be the first to wear our exclusive designs.",
                        image: "https://via.placeholder.com/1920x800?text=New+Arrivals",
                        buttonText: "View Collection",
                        buttonLink: "/product?sort=new",
                        order: 2,
                        active: 1
                    }
                ]);
            }

            // Seed blog posts
            const blogCheck = await db.select().from(blogPosts);
            if (blogCheck.length === 0) {
                await db.insert(blogPosts).values([
                    {
                        title: "The Future of Fashion",
                        excerpt: "Exploring sustainable trends and fabric innovations.",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
                        category: "Trends",
                        author: "Admin"
                    },
                    {
                        title: "Style Guide 101",
                        excerpt: "How to dress for any occasion with confidence.",
                        content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
                        category: "Tips",
                        author: "Stylist"
                    }
                ]);
            }

            // Seed Products
            const productCheck = await db.select().from(products);
            if (productCheck.length === 0) {
                await db.insert(products).values([
                    {
                        title: "Classic White Shirt",
                        price: "29.99",
                        description: "A timeless classic for every wardrobe. 100% Cotton.",
                        category: "Men's Fashion",
                        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
                        ratingRate: "4.5",
                        ratingCount: 120
                    },
                    {
                        title: "Denim Jacket",
                        price: "59.99",
                        description: "Rugged and stylish denim jacket. Perfect for layering.",
                        category: "Men's Fashion",
                        image: "https://images.unsplash.com/photo-1523205565295-f8e91625443b?q=80&w=1458&auto=format&fit=crop",
                        ratingRate: "4.8",
                        ratingCount: 85
                    },
                    {
                        title: "Summer Floral Dress",
                        price: "49.99",
                        description: "Lightweight and breezy dress for summer days.",
                        category: "Women's Fashion",
                        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1446&auto=format&fit=crop",
                        ratingRate: "4.7",
                        ratingCount: 200
                    },
                    {
                        title: "Leather Handbag",
                        price: "89.99",
                        description: "Premium leather handbag with spacious compartments.",
                        category: "Accessories",
                        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1635&auto=format&fit=crop",
                        ratingRate: "4.9",
                        ratingCount: 50
                    },
                    {
                        title: "Casual Sneakers",
                        price: "69.99",
                        description: "Comfortable sneakers for everyday wear.",
                        category: "Men's Fashion",
                        image: "https://images.unsplash.com/photo-1560769629-975e13f51863?q=80&w=1335&auto=format&fit=crop",
                        ratingRate: "4.6",
                        ratingCount: 150
                    },
                    {
                        title: "Sunglasses",
                        price: "19.99",
                        description: "Stylish sunglasses with UV protection.",
                        category: "Accessories",
                        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480&auto=format&fit=crop",
                        ratingRate: "4.4",
                        ratingCount: 90
                    }
                ]);
            }

            // Seed Banners (for Home/Sidebar)
            const bannerCheck = await db.select().from(banners);
            if (bannerCheck.length === 0) {
                 await db.insert(banners).values([
                     {
                         title: "Summer Sale",
                         subtitle: "Up to 50% Off",
                         image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
                         link: "/product?sale=true",
                         position: "home"
                     }
                 ]);
            }

            // Seed Announcements (Top Bar)
            const announcementCheck = await db.select().from(announcements);
            if (announcementCheck.length === 0) {
                await db.insert(announcements).values([
                    {
                        message: "Free Shipping on Orders Over $50! Shop Now.",
                        link: "/product",
                        backgroundColor: "#000000",
                        textColor: "#ffffff",
                        active: 1
                    }
                ]);
            }

            // Seed content for About Sections (resetting as requested)
            await db.delete(aboutSections);
            await db.insert(aboutSections).values([
                {
                    type: 'hero',
                    title: 'Elegance in Every Stitch',
                    subtitle: 'Curated Fashion for the Modern Soul',
                    image: 'https://placehold.co/1500x500/333/fff?text=About+Hero',
                    order: 0,
                    active: 1
                },
                {
                    type: 'content',
                    title: 'Our Story',
                    subtitle: 'Redefining Luxury Since 2024',
                    content: `Prince Garments was born from a passion for timeless style and uncompromising quality. We believe that fashion is not just about what you wear, but how it makes you feel. Every piece in our collection is handpicked to ensure it meets our high standards of craftsmanship. From breathable fabrics to exquisite stitching, we pay attention to the details that matter.`,
                    image: 'https://placehold.co/800x600/e9ecef/333?text=Our+Story',
                    order: 1,
                    active: 1
                },
                {
                    type: 'content',
                    title: 'Sustainable Fashion',
                    subtitle: 'Conscious choices for a better future',
                    content: `We are committed to sustainability. Our materials are sourced responsibly, ensuring fair wages and safe working conditions for all artisans involved. We believe in slow fashion—creating durable pieces that last for years, reducing waste and environmental impact. Join us in making a positive difference, one garment at a time.`,
                    image: 'https://placehold.co/800x600/e9ecef/333?text=Sustainability',
                    order: 2,
                    active: 1
                },
                {
                    type: 'value',
                    title: 'Premium Quality',
                    subtitle: 'fa-star', // Icon class
                    content: 'We use only the finest materials sourced globally.',
                    image: '',
                    order: 3,
                    active: 1
                },
                {
                    type: 'value',
                    title: 'Community First',
                    subtitle: 'fa-users', // Icon class
                    content: 'Our customers are at the heart of everything we do.',
                    image: '',
                    order: 4,
                    active: 1
                },
                {
                    type: 'value',
                    title: 'Eco-Friendly',
                    subtitle: 'fa-leaf', // Icon class
                    content: 'Dedicated to reducing our environmental footprint.',
                    image: '',
                    order: 5,
                    active: 1
                }
            ]);

            return { message: "Content seeded successfully" };
        } catch (error) {
            console.error("Seeding error:", error);
            throw error;
        }
    }
}
