import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { ROLE_PERMISSIONS } from "../constants/permissions.js";

const userService = new UserService();

export class UserController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password);
            if (!result) return res.status(401).json({ error: "Invalid credentials" });
            res.json(result); // Returns { user, token }
        } catch (error) {
            res.status(500).json({ error: "Login failed" });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;
            const result = await userService.register(email, password, name);
            res.json({ message: "Registration successful", userId: result });
        } catch (error) {
            res.status(500).json({ error: "Registration failed" });
        }
    }

    async seedUsers(req: Request, res: Response) {
        try {
            const result = await userService.seedUsers();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Seeding failed" });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const result = await userService.getAllUsers();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = req.body;
            const result = await userService.updateUser(id, data);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to update user" });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await userService.deleteUser(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to delete user" });
        }
    }
    async createUser(req: Request, res: Response) {
        try {
            const { email, password, name, role } = req.body;
            const result = await userService.register(email, password, name, role);
            res.json({ message: "User created successfully", userId: result });
        } catch (error) {
            res.status(500).json({ error: "User creation failed" });
        }
    }

    async getPermissions(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const role = req.user.role;
        // @ts-ignore
        const permissions = ROLE_PERMISSIONS[role] || [];
        res.json({ role, permissions });
    }
}
