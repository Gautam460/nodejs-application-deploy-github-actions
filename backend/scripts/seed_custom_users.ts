
import { UserService } from "../src/services/user.service.js";
import { db } from "../src/config/db.js";

const seed = async () => {
    console.log("Seeding Users...");
    const userService = new UserService();
    try {
        const result = await userService.seedUsers();
        console.log(result.message);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seed();
