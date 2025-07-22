import { Request, Response } from "express";
import db from "../client/connect.js"; 

// POST Help Message
export const postSupportMessage = async (req: Request, res: Response) => {
  const { userId, sellerId, subject, subSubject, relatedId, message } = req.body;

  try {
    const support = await db.support.create({
      data: { userId, sellerId, subject, subSubject, relatedId, message },
    });

    res.status(201).json(support);
  } catch (err) {
    console.error("Error posting support message:", err);
    res.status(500).json({ error: "Failed to post support message" });
  }
};

// GET All Messages for Seller
export const getSupportMessagesBySeller = async (req: Request, res: Response) => {
  const { sellerId } = req.params;

  try {
    const messages = await db.support.findMany({
      where: { sellerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching support messages:", err);
    res.status(500).json({ error: "Failed to fetch support messages" });
  }
};


// DELETE Support Message
export const deleteSupportMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.support.delete({
      where: { id },
    });

    res.status(200).json({ message: "Support message deleted successfully" });
  } catch (err) {
    console.error("Error deleting support message:", err);
    res.status(500).json({ error: "Failed to delete support message" });
  }
};