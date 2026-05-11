import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import heroRoutes from "./routes/hero.routes.js";
import generalRoutes from "./routes/general.routes.js";
import userRoutes from "./routes/user.routes.js";
import contentRoutes from "./routes/content.routes.js";
import dynamicPagesRoutes from "./routes/dynamicPages.routes.js";
import featuredCategoryRoutes from "./routes/featuredCategory.routes.js";
import customOrderRoutes from "./routes/customOrder.routes.js";
import logRoutes from "./routes/log.routes.js";
import roleRoutes from "./routes/role.routes.js";
import resellerRoutes from "./routes/reseller.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import debugRoutes from "./routes/debug.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";


import { logger } from "./utils/logger.js";



const app = express();

// Request Logging Middleware - MOVE TO TOP
app.use((req, res, next) => {
    logger.info(`Received ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
});


// Routes
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", heroRoutes);
app.use("/api", generalRoutes);
app.use("/api", userRoutes);
app.use("/api", contentRoutes);
app.use("/api", dynamicPagesRoutes);
app.use("/api", customOrderRoutes);
app.use("/api", featuredCategoryRoutes);
app.use("/api", roleRoutes);
app.use("/api", logRoutes);
app.use("/api", resellerRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", categoryRoutes);
app.use("/api", debugRoutes);
app.use("/api", aiRoutes);
app.use("/api", chatbotRoutes);


// Global Error Handler for catching 500 errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`API Error [${req.method} ${req.url}]`, err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;
