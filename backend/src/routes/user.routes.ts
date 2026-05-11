import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
const userController = new UserController();

router.post("/auth/login", userController.login.bind(userController));
router.post("/auth/register", userController.register.bind(userController));
router.get("/auth/permissions", authenticate, userController.getPermissions.bind(userController));
router.get("/auth/seed", userController.seedUsers.bind(userController));

// CRUD
// CRUD
router.get("/users", userController.getAllUsers.bind(userController));
router.post("/users", userController.createUser.bind(userController));
router.put("/users/:id", userController.updateUser.bind(userController));
router.delete("/users/:id", userController.deleteUser.bind(userController));

export default router;
