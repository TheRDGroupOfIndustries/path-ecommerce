
import { Request, Response } from "express";
import db from "../client/connect.js";

// 1. Submit Review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, productId, userId } = req.body;

    if (!rating || !productId || !userId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const review = await db.review.create({
      data: {
        rating,
        comment,
        productId,
        userId,
      },
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2. Get All Reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await db.review.findMany({
      include: {
        user: {
          select: { id: true, name: true, imageUrl: true },
        },
        product: {
          select: { id: true, name: true, images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 3. Get Reviews by Product ID
export const getReviewsByProductId = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const reviews = await db.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by product ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
