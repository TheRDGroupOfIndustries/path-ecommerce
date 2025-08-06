import { Request, Response } from "express";
import db from "../client/connect.js"; 

export const saveOrUpdateCommissionLevels = async (req: Request, res: Response) => {
  const levels = req.body; 

  if (!Array.isArray(levels)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    const existing = await db.commissionLevel.findMany();
    
    const tasks = levels.map(async ({ level, percent }) => {
      const found = existing.find((l) => l.level === level);

      if (!found) {
        return db.commissionLevel.create({
          data: { level, percent },
        });
      }

      if (found.percent !== percent) {
        // If percent changed, update it
        return db.commissionLevel.update({
          where: { id: found.id },
          data: { percent },
        });
      }

      return null; // percent unchanged, do nothing
    });

    await Promise.all(tasks);

    return res.status(200).json({ message: "Commission levels saved successfully" });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getCommissionLevels = async (req: Request, res: Response) => {
  try {
    let levels = await db.commissionLevel.findMany({
      orderBy: { level: "asc" },
    });

    if (levels.length === 0) {
      const initial = Array.from({ length: 12 }).map((_, i) => ({
        level: i + 1,
        percent: 0,
      }));

      await db.commissionLevel.createMany({ data: initial });

      levels = await db.commissionLevel.findMany({
        orderBy: { level: "asc" },
      });
    }

    return res.status(200).json(levels);
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch commission levels" });
  }
};
