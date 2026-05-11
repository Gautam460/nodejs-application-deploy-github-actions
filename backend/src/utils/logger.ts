
import fs from "fs";
import path from "path";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
    try {
        fs.mkdirSync(logsDir, { recursive: true });
    } catch (err) {
        console.error("Failed to create logs directory:", err);
    }
}

const getLogFileName = () => {
    const today = new Date().toISOString().split("T")[0];
    return path.join(logsDir, `app-${today}.log`);
};

export const logger = {
    info: (message: string) => {
        const timestamp = new Date().toISOString();
        const msg = typeof message === 'object' ? JSON.stringify(message) : message;
        const logEntry = `[INFO] [${timestamp}] ${msg}\n`;
        fs.appendFile(getLogFileName(), logEntry, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        console.log(`[INFO] ${msg}`);
    },

    error: (message: string, error?: any) => {
        const timestamp = new Date().toISOString();
        const msg = typeof message === 'object' ? JSON.stringify(message) : message;
        const errorStack = error?.stack || (typeof error === 'object' ? JSON.stringify(error) : error) || "";
        const logEntry = `[ERROR] [${timestamp}] ${msg} ${errorStack}\n`;
        fs.appendFile(getLogFileName(), logEntry, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        console.error(`[ERROR] ${msg}`, error);
    },

    warn: (message: string) => {
        const timestamp = new Date().toISOString();
        const msg = typeof message === 'object' ? JSON.stringify(message) : message;
        const logEntry = `[WARN] [${timestamp}] ${msg}\n`;
        fs.appendFile(getLogFileName(), logEntry, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        console.warn(`[WARN] ${msg}`);
    },

    readLogs: (date?: string) => {
        const targetDate = date || new Date().toISOString().split("T")[0];
        const logFile = path.join(logsDir, `app-${targetDate}.log`);

        return new Promise<string[]>((resolve, reject) => {
            if (!fs.existsSync(logFile)) {
                return resolve([]); 
            }

            fs.readFile(logFile, "utf-8", (err, data) => {
                if (err) return reject(err);
                // Return latest logs first
                const lines = data.trim().split("\n").filter(line => line).reverse();
                resolve(lines);
            });
        });
    }
};
