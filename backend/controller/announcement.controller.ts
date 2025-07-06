import { Request, Response } from "express";
import db from "../client/connect.js"; // your Prisma client

// Get all announcements
export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Server error while fetching announcements." });
  }
};

// Create a new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text is required." });
  }

  try {
    const announcement = await db.announcement.create({
      data: { text: text.trim() },
    });
    res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Server error while creating announcement." });
  }
};

// Update announcement
export const updateAnnouncement = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text is required." });
  }

  try {
    const updated = await db.announcement.update({
      where: { id},
      data: { text: text.trim() },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Server error while updating announcement." });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.announcement.delete({
      where: { id },
    });
    res.status(200).json({ message: "Announcement deleted." });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Server error while deleting announcement." });
  }
};
