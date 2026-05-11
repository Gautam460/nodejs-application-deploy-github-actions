import type { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const product = await productService.getProductById(id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  async getProductsByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category as string;
      const products = await productService.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  }

  async seedProducts(req: Request, res: Response) {
    try {
      const result = await productService.seedProducts();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Seeding failed" });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const result = await productService.createProduct(req.body);
      res.status(201).json({ message: "Product created successfully", id: result });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await productService.updateProduct(id, req.body);
      res.json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await productService.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
}
