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

// export const applyReferralCode = async (req: Request, res: Response) => {
//   const { code, productId } = req.body;

//   try {
//     if (!code || !productId || typeof code !== "string") {
//       return res.status(400).json({ error: "Referral code and productId are required" });
//     }

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ error: "Unauthorized user" });
//     }

//     const userId = req.user.id;

//     const referral = await db.referral.findUnique({
//       where: { referral: code },
//       include: { createdFor: true },
//     });

//     const user = await db.user.findUnique({where: { id: userId }, include: { orders: true }});
//     if (!referral) return res.status(404).json({ error: "Invalid referral code" });

//     const product = await db.products.findUnique({ where: { id: productId } });
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     const percent = parseFloat(code.split("-")[1]);
//     if (isNaN(percent)) return res.status(400).json({ error: "Invalid referral format" });

//     const originalPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
//     const discountAmount = (originalPrice * percent) / 100;
//     const discountedPrice = originalPrice - discountAmount;

//     await db.referralTransaction.create({
//       data: {
//         referralId: referral.id,
//         associateId: referral.createdForId,
//         userId,
//         productId: product.id,
//         productName: product.name,
//         price: originalPrice,
//         percent,
//         commission: discountAmount,
//         sellerId: product.sellerId,
//       },
//     });

//     const updatedReferral = await db.referral.findUnique({
//   where: { id: referral.id },
// });

// if (!updatedReferral.usedBy.includes(userId)) {
//   await db.referral.update({
//     where: { id: referral.id },
//     data: {
//       usedBy: {
//         push: userId,
//       },
//     },
//   });
// }

//     res.status(200).json({
//       message: "Referral applied successfully",
//       originalPrice,
//       discountPercent: percent,
//       discountedPrice,
//       commission: discountAmount,
//     });
//   } catch (err) {
//     console.error("Error applying referral:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

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

    // Fetch referral and user
    const referral = await db.referral.findUnique({
      where: { referral: code },
      include: { createdFor: true },
    });

    if (!referral) {
      return res.status(404).json({ error: "Invalid referral code" });
    }

    // Prevent the user from using their own referral code
    if (referral.createdForId === userId) {
      return res.status(400).json({ error: "You cannot use your own referral code" });
    }

    // Check if user has already used the referral code
    const alreadyUsed = referral.usedBy.includes(userId);
    if (alreadyUsed) {
      return res.status(400).json({ error: "Referral code already used by this user" });
    }

    // Check if product exists
    const product = await db.products.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculate discount
    const percent = parseFloat(code.split("-")[1]);
    if (isNaN(percent)) {
      return res.status(400).json({ error: "Invalid referral format" });
    }

    const originalPrice =
      typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const discountAmount = (originalPrice * percent) / 100;
    const discountedPrice = originalPrice - discountAmount;

    // Create referral transaction
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

    // Add userId to usedBy list (only if not present — already checked above)
    await db.referral.update({
      where: { id: referral.id },
      data: {
        usedBy: {
          push: userId,
        },
      },
    });

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
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                imageUrl: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                category: true,
              },
            },
            associate: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                imageUrl: true,
              },
            },
          },
        },
        createdFor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!referrals || referrals.length === 0) {
      return res.status(404).json({ error: "No referrals found for this associate" });
    }

    // Collect unique usedBy user IDs
    const allUsedByIds = referrals.flatMap((r) => r.usedBy);
    const uniqueUsedByIds = [...new Set(allUsedByIds)];

    const usedByUsers = await db.user.findMany({
      where: { id: { in: uniqueUsedByIds } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    // Deduplicate transactions (referralId + userId)
    const seenPairs = new Set<string>();
    const uniqueTransactions = [];

    for (const referral of referrals) {
      for (const txn of referral.transactions) {
        const key = `${referral.id}_${txn.userId}`;
        if (!seenPairs.has(key)) {
          seenPairs.add(key);
          uniqueTransactions.push(txn);
        }
      }
    }

    // Calculate total revenue from deduplicated transactions
    const totalRevenue = uniqueTransactions.reduce((sum, txn) => sum + txn.commission, 0);

    // Final response
    res.status(200).json({
      totalReferralCodes: referrals.length,
      totalUsedByUsers: uniqueUsedByIds.length,
      totalTransactions: uniqueTransactions.length,
      totalRevenue,
      createdFor: referrals[0].createdFor,
      usedByUsers,
     referrals: referrals.map((r) => {
      const userSeen = new Set<string>();
      const uniqueTxns = [];

      for (const txn of r.transactions) {
        if (!userSeen.has(txn.userId)) {
          userSeen.add(txn.userId);
          uniqueTxns.push(txn);
        }
      }
      return {
        id: r.id,
        referralCode: r.referral,
        totalUsedBy: r.usedBy.length,
        totalTransactions: uniqueTxns.length,
        transactions: uniqueTxns,
      };
    }),

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



