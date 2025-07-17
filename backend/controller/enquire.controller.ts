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
        createdAt: "desc", 
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


export const getAllEnquiriesByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return; 
    }

    let enquiries;

    if (user.role === "ADMIN"|| user.role === "USER") {
      // Admin: get all enquiries
      enquiries = await db.enquire.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else if (user.role === "SELLER") {
      // Seller: fetch enquiries related to seller's properties or marketplaces
      enquiries = await db.enquire.findMany({
        where: {
          OR: [
            {
              marketplace: {
                createdById: user.id,
              },
            },
            {
              property: {
                createdById: user.id,
              },
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          marketplace: true,
          property: true,
        },
      });
    } else {
      res.status(403).json({ message: "Forbidden" });
      return; 
    }

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
