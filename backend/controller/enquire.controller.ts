import { Request, Response } from "express";
import db from "../client/connect.js";

export const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, subject, message, marketplaceId, propertyId } = req.body;

  try {
    const enquiry = await db.enquire.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        ...(marketplaceId ? { marketplaceId } : {}),
        ...(propertyId ? { propertyId } : {})
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


export const getAllEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const enquiries = await db.enquire.findMany({
      orderBy: {
        createdAt: "desc", //  fetch latest first
      },
    });
    res.status(200).json(enquiries);
  } catch (error: any) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      error: "Failed to fetch enquiries",
      details: error?.message || error,
    });
  }
};

export const deleteEnquiry = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await db.enquire.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Enquiry deleted successfully",
      deleted,
    });
  } catch (error: any) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({
      error: "Failed to delete enquiry",
      details: error?.message || error,
    });
  }
};
