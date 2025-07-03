import { Request, Response } from "express";
import db from "../client/connect.js";
import { getReferralByUser, createReferral } from "../model/referral.model.js";

//  Create or Update Referral
export const createOrUpdateReferral = async (req: Request, res: Response) => {
  const { associateId, percent } = req.body;

  try {
    const user = await db.user.findUnique({ where: { id: associateId } });

    if (!user || user.role !== "ASSOCIATE") {
      return res.status(404).json({ error: "User not found or not an associate" });
    }

    const firstName = user.name.split(" ")[0].toLowerCase();
    const referralCode = `${firstName}-${percent}`;

    // Check if referral code already exists for another user
    const existingCode = await db.referral.findUnique({ where: { referral: referralCode } });
    if (existingCode && existingCode.createdForId !== associateId) {
      return res.status(400).json({ error: "Referral code already exists for another associate" });
    }

    let referral = await getReferralByUser(associateId);

    if (!referral) {
      referral = await createReferral(referralCode, associateId, [associateId]);
    } else {
      const updatedUsedBy = referral.usedBy?.includes(associateId)
        ? referral.usedBy
        : [...referral.usedBy, associateId];

      referral = await db.referral.update({
        where: { id: referral.id },
        data: {
          referral: referralCode,
          usedBy: updatedUsedBy,
        },
      });
    }

    res.status(200).json({ message: "Referral processed successfully", referral });
  } catch (err) {
    console.error("Error processing referral:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Check Referral Code Validity
export const checkReferralCode = async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Referral code is required" });
    }

    const referral = await db.referral.findUnique({
      where: { referral: code },
      include: {
        createdFor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!referral) {
      return res.status(404).json({ valid: false, error: "Referral code is invalid" });
    }

    return res.status(200).json({
      valid: true,
      message: "Referral code is valid",
      referral: {
        referralCode: referral.referral,
        createdBy: referral.createdFor,
        usedBy: referral.usedBy,
      },
    });
  } catch (err) {
    console.error("Error checking referral code:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//apply

export const applyReferralCode = async (req: Request, res: Response) => {
  const { code, productId } = req.body;

  try {
    if (!code || typeof code !== "string" || !productId) {
      return res.status(400).json({ error: "Referral code and productId are required" });
    }

    const referral = await db.referral.findUnique({
      where: { referral: code },
    });

    if (!referral) {
      return res.status(404).json({ error: "Invalid referral code" });
    }

    const product = await db.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const parts = code.split("-");
    const percent = parseFloat(parts[1]);

    if (isNaN(percent)) {
      return res.status(400).json({ error: "Invalid referral percentage format" });
    }

    const originalPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const discountAmount = (originalPrice * percent) / 100;
    const discountedPrice = originalPrice - discountAmount;

    return res.status(200).json({
      message: "Referral applied successfully",
      originalPrice,
      discountPercent: percent,
      discountedPrice,
    });
  } catch (err) {
    console.error("Error applying referral code:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
