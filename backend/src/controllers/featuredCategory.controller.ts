import type { Request, Response } from "express";
import { FeaturedCategoryService } from "../services/featuredCategory.service.js";

const service = new FeaturedCategoryService();

export class FeaturedCategoryController {
  async getActiveCategories(req: Request, res: Response) {
    try {
      const categories = await service.getActiveCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }

  async getAllCategories(req: Request, res: Response) {
      try {
        const categories = await service.getAllCategories();
        res.json(categories);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch all categories" });
      }
    }

  async createCategory(req: Request, res: Response) {
    try {
      const result = await service.createCategory(req.body);
      res.status(201).json({ message: "Category created successfully", id: result });
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = parseInt((req.params.id as string) || '0');
      await service.updateCategory(id, req.body);
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = parseInt((req.params.id as string) || '0');
      await service.deleteCategory(id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  }
}
