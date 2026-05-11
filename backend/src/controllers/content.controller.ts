import type { Request, Response } from "express";
import { ContentService } from "../services/content.service.js";

const contentService = new ContentService();

export class ContentController {
    async getSiteSettings(req: Request, res: Response) {
        try {
            const settings = await contentService.getSiteSettings();
            res.json(settings);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch settings" });
        }
    }

    async updateSiteSettings(req: Request, res: Response) {
        try {
            const result = await contentService.updateSiteSettings(req.body);
            res.json({ message: "Settings updated", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to update settings" });
        }
    }

    async getMenuItems(req: Request, res: Response) {
        try {
            const menu = await contentService.getMenuItems();
            res.json(menu);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch menu" });
        }
    }

    async createMenuItem(req: Request, res: Response) {
        try {
            const result = await contentService.createMenuItem(req.body);
            res.status(201).json({ message: "Menu item created", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to create menu item" });
        }
    }

    async updateMenuItem(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.updateMenuItem(id, req.body);
            res.json({ message: "Menu item updated", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to update menu item" });
        }
    }

    async deleteMenuItem(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.deleteMenuItem(id);
            res.json({ message: "Menu item deleted", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete menu item" });
        }
    }

    async getFooterData(req: Request, res: Response) {
        try {
            const footer = await contentService.getFooterData();
            res.json(footer);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch footer" });
        }
    }

    async getHomeSections(req: Request, res: Response) {
        try {
            const sections = await contentService.getHomeSections();
            res.json(sections);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch home sections" });
        }
    }

    async getFeaturedCategories(req: Request, res: Response) {
        try {
            const categories = await contentService.getFeaturedCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch categories" });
        }
    }

    async getBanners(req: Request, res: Response) {
        try {
            const position = req.query.position as string || 'home';
            const banners = await contentService.getBanners(position);
            res.json(banners);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch banners" });
        }
    }

    async createBanner(req: Request, res: Response) {
        try {
            const result = await contentService.createBanner(req.body);
            res.status(201).json({ message: "Banner created", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to create banner" });
        }
    }

    async updateBanner(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.updateBanner(id, req.body);
            res.json({ message: "Banner updated", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to update banner" });
        }
    }

    async deleteBanner(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.deleteBanner(id);
            res.json({ message: "Banner deleted", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete banner" });
        }
    

    }

    async getTestimonials(req: Request, res: Response) {
        try {
            const testimonials = await contentService.getTestimonials();
            res.json(testimonials);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch testimonials" });
        }
    }

    async getAnnouncements(req: Request, res: Response) {
        try {
            const announcements = await contentService.getAnnouncements();
            res.json(announcements);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch announcements" });
        }
    }

    async getAboutSections(req: Request, res: Response) {
        try {
            const sections = await contentService.getAboutSections();
            res.json(sections);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch about sections" });
        }
    }

    async createAboutSection(req: Request, res: Response) {
        try {
            const result = await contentService.createAboutSection(req.body);
            res.json({ message: "Section created", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to create section" });
        }
    }

    async updateAboutSection(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.updateAboutSection(id, req.body);
            res.json({ message: "Section updated", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to update section" });
        }
    }

    async deleteAboutSection(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.deleteAboutSection(id);
            res.json({ message: "Section deleted", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete section" });
        }
    }

    // Featured Categories CRUD
    async createFeaturedCategory(req: Request, res: Response) {
        try {
            const result = await contentService.createFeaturedCategory(req.body);
            res.status(201).json({ message: "Category created", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to create category" });
        }
    }

    async updateFeaturedCategory(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.updateFeaturedCategory(id, req.body);
            res.json({ message: "Category updated", result });
        } catch (error) {
            console.error("Update featured category error:", error);
            res.status(500).json({ error: "Failed to update category" });
        }
    }

    async deleteFeaturedCategory(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const result = await contentService.deleteFeaturedCategory(id);
            res.json({ message: "Category deleted", result });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete category" });
        }
    }

    async seedContent(req: Request, res: Response) {
        try {
            const result = await contentService.seedContent();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Seeding failed" });
        }
    }
}
