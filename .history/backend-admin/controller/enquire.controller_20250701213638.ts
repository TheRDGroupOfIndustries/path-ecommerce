import { Request, Response } from "express";
import db from "../client/connect.js";

export const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, message, marketplaceId, propertyId } = req.body;

  try {
    const enquiry = await db.enquire.create({
      data: {
        name,
        email,
        phone,
        message,
        ...(marketplaceId ? { marketplaceId } : {}),
        ...(propertyId ? { propertyId } : {}) // won't include if undefinedempty
      },
    });

    res.status(201).json({ message: "Enquiry created successfully", enquiry });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({
      error: "Failed to create enquiry",
      details: error?.message || error,
    });
  }
};
