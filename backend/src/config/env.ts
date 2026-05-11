import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Configuration object for the application
export const config = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || "localhost", // Always localhost because DB runs on the same machine
    user: process.env.DB_USER || (process.env.NODE_ENV === 'production' ? "princegarments" : "root"),
    password: process.env.DB_PASSWORD || (process.env.NODE_ENV === 'production' ? "IlDaiuyW1ylt8bZ" : "Gautam@123#"),
    name: process.env.DB_NAME || (process.env.NODE_ENV === 'production' ? "princegarments_db" : "prince_garments"),
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    model: process.env.OPENROUTER_MODEL || "z-ai/glm-4.5-air:free",
    modelFallback: process.env.OPENROUTER_MODEL_FALLBACK || "meta-llama/llama-3.2-3b-instruct:free",
    referer: process.env.OPENROUTER_HTTP_REFERER || "",
    title: process.env.OPENROUTER_X_TITLE || "react-ecommerce",
    timeout: parseInt(process.env.OPENROUTER_TIMEOUT || "120000"), // Default to 120 seconds
  },
};
