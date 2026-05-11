import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();
const productController = new ProductController();

router.get("/products", productController.getAllProducts.bind(productController));
router.get("/products/:id", productController.getProductById.bind(productController));
router.get("/products/category/:category", productController.getProductsByCategory.bind(productController));
router.post("/products", productController.createProduct.bind(productController));
router.put("/products/:id", productController.updateProduct.bind(productController));
router.delete("/products/:id", productController.deleteProduct.bind(productController));
router.get("/seed", productController.seedProducts.bind(productController));

export default router;
