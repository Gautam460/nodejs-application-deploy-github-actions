import type { Request, Response } from "express";
import { HeroService } from "../services/hero.service.js";

const heroService = new HeroService();

export class HeroController {
  async getSlides(req: Request, res: Response) {
    try {
      const slides = await heroService.getActiveSlides();
      res.json(slides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slides" });
    }
  }

  async seedSlides(req: Request, res: Response) {
      try {
          const result = await heroService.seedSlides();
          res.json(result);
      } catch (error) {
          res.status(500).json({ error: "Failed to seed slides" });
      }
  }

  async createSlide(req: Request, res: Response) {
    try {
      const result = await heroService.createSlide(req.body);
      res.status(201).json({ message: "Slide created successfully", id: result });
    } catch (error) {
      console.error("Create slide error:", error);
      res.status(500).json({ error: "Failed to create slide" });
    }
  }

  async updateSlide(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await heroService.updateSlide(id, req.body);
      res.json({ message: "Slide updated successfully" });
    } catch (error) {
      console.error("Update slide error:", error);
      res.status(500).json({ error: "Failed to update slide" });
    }
  }

  async deleteSlide(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await heroService.deleteSlide(id);
      res.json({ message: "Slide deleted successfully" });
    } catch (error) {
      console.error("Delete slide error:", error);
      res.status(500).json({ error: "Failed to delete slide" });
    }
  }
}
