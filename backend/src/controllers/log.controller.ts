
import type { Request, Response } from "express";
import { logger } from "../utils/logger.js";


export const getLogs = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        const logs = await logger.readLogs(date as string);
        res.json({ logs });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch logs", error });
    }
};
