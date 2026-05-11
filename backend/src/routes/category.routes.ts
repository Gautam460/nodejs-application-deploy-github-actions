import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { isSuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new CategoryController();

router.get("/categories", controller.getActiveCategories.bind(controller));
router.get("/categories/all", controller.getAllCategories.bind(controller));
router.post("/categories", isSuperAdmin, controller.createCategory.bind(controller));
router.put("/categories/:id", isSuperAdmin, controller.updateCategory.bind(controller));
router.delete("/categories/:id", isSuperAdmin, controller.deleteCategory.bind(controller));

export default router;

