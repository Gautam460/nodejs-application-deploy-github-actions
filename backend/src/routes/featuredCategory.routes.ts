import { Router } from "express";
import { FeaturedCategoryController } from "../controllers/featuredCategory.controller.js";

const router = Router();
const controller = new FeaturedCategoryController();

router.get("/featured-categories", controller.getActiveCategories);
router.get("/featured-categories/all", controller.getAllCategories);
router.post("/featured-categories", controller.createCategory);
router.put("/featured-categories/:id", controller.updateCategory);
router.delete("/featured-categories/:id", controller.deleteCategory);

export default router;
