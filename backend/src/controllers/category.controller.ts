import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";

const service = new CategoryService();

export class CategoryController {
  async getActiveCategories(req: Request, res: Response) {
    try {
      const categories = await service.getActiveCategories();
      return res.json(categories);
    } catch (error) {
      console.error("Get active categories error:", error);
      // Return empty list instead of 500 to avoid frontend break if table/migration missing
      return res.json([]);
    }
  }

  async getAllCategories(req: Request, res: Response) {
      try {
        const categories = await service.getAllCategories();
        return res.json(categories);
      } catch (error) {
        console.error("Get all categories error:", error);
        // Return empty list on error
        return res.json([]);
      }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const result = await service.createCategory(req.body);
      return res.status(201).json({ message: "Category created successfully", id: result });
    } catch (error: any) {
      console.error("Create category error:", error);
      if (error.message && error.message.startsWith("ValidationError")) {
        return res.status(400).json({ error: error.message.replace("ValidationError: ", "") });
      }
      if (error.message && error.message.startsWith("ConflictError")) {
        return res.status(409).json({ error: error.message.replace("ConflictError: ", "") });
      }
      return res.status(500).json({ error: "Failed to create category", detail: error.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = parseInt((req.params.id as string) || "0");
      await service.updateCategory(id, req.body);
      return res.json({ message: "Category updated successfully" });
    } catch (error: any) {
      console.error("Update category error:", error);
      if (error.message && error.message.startsWith("ValidationError")) {
        return res.status(400).json({ error: error.message.replace("ValidationError: ", "") });
      }
      if (error.message && error.message.startsWith("ConflictError")) {
        return res.status(409).json({ error: error.message.replace("ConflictError: ", "") });
      }
      return res.status(500).json({ error: "Failed to update category", detail: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = parseInt((req.params.id as string) || "0");
      await service.deleteCategory(id);
      return res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      console.error("Delete category error:", error);
      if (error.message && error.message.includes("child")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message || "Failed to delete category" });
    }
  }
}

