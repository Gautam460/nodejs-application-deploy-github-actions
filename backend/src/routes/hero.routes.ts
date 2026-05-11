import { Router } from "express";
import { HeroController } from "../controllers/hero.controller.js";

const router = Router();
const heroController = new HeroController();

router.get("/hero-slides", heroController.getSlides.bind(heroController));
router.post("/hero-slides", heroController.createSlide.bind(heroController));
router.put("/hero-slides/:id", heroController.updateSlide.bind(heroController));
router.delete("/hero-slides/:id", heroController.deleteSlide.bind(heroController));
router.get("/hero-slides/seed", heroController.seedSlides.bind(heroController));

export default router;
