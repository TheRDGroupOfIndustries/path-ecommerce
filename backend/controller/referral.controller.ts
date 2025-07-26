import { Request, Response } from "express";
import db from "../client/connect.js";

//  Create Referral 
export const createReferral = async (req: Request, res: Response) => {
  const { associateId, percent } = req.body;

  try {
    const user = await db.user.findUnique({ where: { id: associateId } });

    if (!user || user.role !== "ASSOCIATE") {
      return res.status(404).json({ error: "User not found or not an associate" });
    }

    const firstName = user.name.split(" ")[0].toLowerCase();
    const referralCode = `${firstName}-${percent}`;

    const existingCode = await db.referral.findUnique({
    where: { referral: referralCode },
    });

    if (existingCode) {
      if (existingCode.createdForId === associateId) {
        return res.status(400).json({ error: "Referral code already exists for this associate" });
      } else {
        return res.status(400).json({ error: "Referral code already exists for another associate" });
      }
    }

    const referral = await db.referral.create({
      data: {
        referral: referralCode,
        createdForId: associateId,
        usedBy: [],
      },
    });

    res.status(201).json({ message: "Referral created successfully", referral });
  } catch (err) {
    console.error("Error creating referral:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  Check Referral Code
export const checkReferralCode = async (req: Request, res: Response) => {
  const { code, productId } = req.body;

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
    const userId = req.user.id;
    const user = await db.user.findUnique({where: { id: userId }, include: { orders: true }});
    const existingOrder = user.orders.find(order => order.productId === productId && order.referralCode === code);
      if (existingOrder) {
        return res.status(400).json({ error: "You already used this referral code" });
      }
    if (!referral) {
      return res.status(404).json({ valid: false, error: "Referral code is invalid" });
    }

    res.status(200).json({
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

// Apply Referral Code

export const applyReferralCode = async (req: Request, res: Response) => {
  const { code, productId } = req.body;

  try {
    if (!code || !productId || typeof code !== "string") {
      return res.status(400).json({ error: "Referral code and productId are required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const userId = req.user.id;

    const referral = await db.referral.findUnique({
      where: { referral: code },
      include: { createdFor: true },
    });

    const user = await db.user.findUnique({where: { id: userId }, include: { orders: true }});
    if (!referral) return res.status(404).json({ error: "Invalid referral code" });

    const product = await db.products.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const percent = parseFloat(code.split("-")[1]);
    if (isNaN(percent)) return res.status(400).json({ error: "Invalid referral format" });

    const originalPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const discountAmount = (originalPrice * percent) / 100;
    const discountedPrice = originalPrice - discountAmount;

    await db.referralTransaction.create({
      data: {
        referralId: referral.id,
        associateId: referral.createdForId,
        userId,
        productId: product.id,
        productName: product.name,
        price: originalPrice,
        percent,
        commission: discountAmount,
        sellerId: product.sellerId,
      },
    });

    const updatedReferral = await db.referral.findUnique({
  where: { id: referral.id },
});

if (!updatedReferral.usedBy.includes(userId)) {
  await db.referral.update({
    where: { id: referral.id },
    data: {
      usedBy: {
        push: userId,
      },
    },
  });
}

    res.status(200).json({
      message: "Referral applied successfully",
      originalPrice,
      discountPercent: percent,
      discountedPrice,
      commission: discountAmount,
    });
  } catch (err) {
    console.error("Error applying referral:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getAllReferralRevenue = async (req: Request, res: Response) => {
  try {
     //@ts-ignore
    const revenue = await db.referralTransaction.groupBy({
      by: ['associateId'],
      _sum: {
        commission: true,
      },
    });

    const detailed = await Promise.all(
      revenue.map(async (r: { associateId: any; _sum: { commission: any; }; }) => {
        const user = await db.user.findUnique({ where: { id: r.associateId } });
        return {
          associateId: r.associateId,
          name: user?.name || "N/A",
          email: user?.email || "N/A",
          totalCommission: r._sum.commission || 0,
        };
      })
    );

    res.status(200).json(detailed);
  } catch (err) {
    console.error("Error fetching referral revenue:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Delete Referral By ID
export const deleteReferral = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const referral = await db.referral.findUnique({ where: { id } });
    if (!referral) return res.status(404).json({ error: "Referral not found" });

    await db.referralTransaction.deleteMany({ where: { referralId: id } });
    await db.referral.delete({ where: { id } });

    res.status(200).json({ message: "Referral deleted successfully" });
  } catch (err) {
    console.error("Error deleting referral:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Referrals for Associate
export const getReferralDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const referrals = await db.referral.findMany({
      where: { createdForId: id },
      include: {
        transactions: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true, imageUrl: true },
            },
            product: {
              select: { id: true, name: true, price: true, images: true, category: true },
            },
            associate: {
              select: { id: true, name: true, email: true, phone: true, imageUrl: true },
            },
            referral: {
              select: { referral: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        createdFor: {
          select: {
            id: true, name: true, email: true, phone: true, imageUrl: true, role: true, createdAt: true,
          },
        },
      },
    });

    if (!referrals || referrals.length === 0) {
      return res.status(404).json({ error: "No referrals found for this associate" });
    }

    const allUsedByIds = referrals.flatMap((r: { usedBy: any; }) => r.usedBy);

    const usedByUsers = await db.user.findMany({
      where: { id: { in: allUsedByIds } },
      select: { id: true, name: true, email: true, phone: true, imageUrl: true, createdAt: true },
    });

    res.status(200).json({
      totalReferralCodes: referrals.length,
      referrals: referrals.map((r: { id: any; referral: any; usedBy: string | any[]; transactions: string | any[]; }) => ({
        id: r.id,
        referralCode: r.referral,
        totalUsedBy: r.usedBy.length,
        totalTransactions: r.transactions.length,
        transactions: r.transactions,
      })),
      createdFor: referrals[0].createdFor,
      usedByUsers,
    });
  } catch (err) {
    console.error("Error fetching referral details", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Simple Referral Code Validation
export const validateReferralCode = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    if (!code || typeof code !== "string") {
      return res.status(400).json({ valid: false, error: "Referral code is required" });
    }

    const referral = await db.referral.findUnique({
      where: { referral: code },
    });

    if (!referral) {
      return res.status(404).json({ valid: false, error: "Referral code not found" });
    }

    return res.status(200).json({ valid: true, message: "Referral code is valid" });
  } catch (err) {
    console.error("Error validating referral code:", err);
    return res.status(500).json({ valid: false, error: "Internal Server Error" });
  }
};



