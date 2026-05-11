import { Router } from "express";
import { ContentController } from "../controllers/content.controller.js";

const router = Router();
const contentController = new ContentController();

// Public routes - no authentication needed
router.get("/content/settings", contentController.getSiteSettings.bind(contentController));
router.put("/content/settings", contentController.updateSiteSettings.bind(contentController));
router.get("/content/menu", contentController.getMenuItems.bind(contentController));
router.post("/content/menu", contentController.createMenuItem.bind(contentController));
router.put("/content/menu/:id", contentController.updateMenuItem.bind(contentController));
router.delete("/content/menu/:id", contentController.deleteMenuItem.bind(contentController));
router.get("/content/footer", contentController.getFooterData.bind(contentController));
router.get("/content/home-sections", contentController.getHomeSections.bind(contentController));
router.get("/content/categories", contentController.getFeaturedCategories.bind(contentController));
router.get("/content/banners", contentController.getBanners.bind(contentController));
router.post("/content/banners", contentController.createBanner.bind(contentController));
router.put("/content/banners/:id", contentController.updateBanner.bind(contentController));
router.delete("/content/banners/:id", contentController.deleteBanner.bind(contentController));
router.get("/content/testimonials", contentController.getTestimonials.bind(contentController));
router.get("/content/announcements", contentController.getAnnouncements.bind(contentController));

// About sections Management
router.get("/content/about-sections", contentController.getAboutSections.bind(contentController));
router.post("/content/about-sections", contentController.createAboutSection.bind(contentController));
router.put("/content/about-sections/:id", contentController.updateAboutSection.bind(contentController));
router.delete("/content/about-sections/:id", contentController.deleteAboutSection.bind(contentController));

// Featured Categories Management
router.post("/content/categories", contentController.createFeaturedCategory.bind(contentController));
router.put("/content/categories/:id", contentController.updateFeaturedCategory.bind(contentController));
router.delete("/content/categories/:id", contentController.deleteFeaturedCategory.bind(contentController));

router.get("/content/seed", contentController.seedContent.bind(contentController));

export default router;
