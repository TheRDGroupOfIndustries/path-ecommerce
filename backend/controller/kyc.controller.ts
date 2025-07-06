import { Request, Response } from "express";
import db from "../client/connect.js";
import { Prisma } from "@prisma/client";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary";

// Extend Request to include `user` and `files` for TypeScript
interface MulterRequest extends Request {
  user?: { id: string; role: string };
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

// Create KYC
export const createKyc = async (req: MulterRequest, res: Response) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await db.kyc.findUnique({ where: { sellerId } });
    if (existing) {
      return res.status(400).json({ msg: "KYC already submitted." });
    }

    const files = req.files;

    // ✅ Helper to upload file to Cloudinary and return URL string
    const getUrl = async (field: string): Promise<string | null> => {
      const file = files?.[field]?.[0];
      return file ? await uploadBufferToCloudinary(file.buffer, field) : null;
    };

    const data: Prisma.KycCreateInput = {
      fullName: req.body.fullName,
      dateOfBirth: new Date(req.body.dateOfBirth),
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      aadharNumber: req.body.aadharNumber,
      panNumber: req.body.panNumber,
      aadharFront: (await getUrl("aadharFront")) ?? "",
      aadharBack: (await getUrl("aadharBack")) ?? "",
      panCard: (await getUrl("panCard")) ?? "",
      passport: await getUrl("passport"),
      bankStatement: await getUrl("bankStatement"),
      salarySlip: await getUrl("salarySlip"),
      image: (await getUrl("image")) ?? "",
      status: "PENDING",
      seller: { connect: { id: sellerId } },
    };

    const created = await db.kyc.create({ data });
    res.status(201).json({ msg: "KYC submitted", kyc: created });
    // console.log("FILES RECEIVED IN REQ.FILES:", req.files);
    // console.log("BODY RECEIVED IN REQ.BODY:", req.body);

  } catch (error: any) {
    console.error("Create KYC error:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get KYC by seller
export const getKycBySeller = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const kyc = await db.kyc.findUnique({ where: { sellerId } });
    if (!kyc) return res.status(404).json({ msg: "No KYC found." });

    res.json(kyc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all KYC (admin only)
export const getAllKyc = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "ADMIN") {
     return res.status(403).json({ message: "Forbidden" });
    }

    const all = await db.kyc.findMany({ include: { seller: true } });
    res.json(all);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Approve KYC
export const approveKyc = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const id = req.params.id;
    const updated = await db.kyc.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    res.json({ msg: "KYC approved", kyc: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Reject KYC
export const rejectKyc = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const id = req.params.id;
    const updated = await db.kyc.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    res.json({ msg: "KYC rejected", kyc: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

