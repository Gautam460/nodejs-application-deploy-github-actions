import { Router } from "express";
import { GeneralController } from "../controllers/general.controller.js";

const router = Router();
const generalController = new GeneralController();

router.post("/contact", generalController.submitContact.bind(generalController));
router.get("/blog", generalController.getBlogPosts.bind(generalController));
router.get("/blog/seed", generalController.seedBlog.bind(generalController));

export default router;
