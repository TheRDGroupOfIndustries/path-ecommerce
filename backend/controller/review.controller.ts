import { Request, Response } from "express";
import db from "../client/connect.js";

// 1. Submit Review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, userId, productId, marketplaceId, propertyId } = req.body;

    // At least one type of review target should be present
    if (!rating || !userId || (!productId && !marketplaceId && !propertyId)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = await db.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
        marketplaceId,
        propertyId,
      },
      include: {
        user: { select: { id: true, name: true, imageUrl: true } },
        product: { select: { id: true, name: true, images: true, description: true } },
        marketplace: { select: { id: true, name: true, imageUrl: true, description: true } },
        property: { select: { id: true, name: true, imageUrl: true, description: true } },
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
        user: { select: { id: true, name: true, imageUrl: true } },
        product: { select: { id: true, name: true, images: true, description: true } },
        marketplace: { select: { id: true, name: true, imageUrl: true, description: true } },
        property: { select: { id: true, name: true, imageUrl: true, description: true } },
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
        user: { select: { id: true, name: true, imageUrl: true } },
        product: { select: { id: true, name: true, images: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 4. Get Reviews by Marketplace ID
export const getReviewsByMarketplaceId = async (req: Request, res: Response) => {
  const { marketplaceId } = req.params;

  try {
    const reviews = await db.review.findMany({
      where: { marketplaceId },
      include: {
        user: { select: { id: true, name: true, imageUrl: true } },
        marketplace: { select: { id: true, name: true, imageUrl: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching marketplace reviews:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 5. Get Reviews by Property ID
export const getReviewsByPropertyId = async (req: Request, res: Response) => {
  const { propertyId } = req.params;

  try {
    const reviews = await db.review.findMany({
      where: { propertyId },
      include: {
        user: { select: { id: true, name: true, imageUrl: true } },
        property: { select: { id: true, name: true, imageUrl: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching property reviews:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
