import { Request, Response } from "express";
import db from "../client/connect.js";

export const getHighLevelAssociates = async (req: Request, res: Response) => {
  try {
    const levels = await db.commissionLevel.findMany({
      orderBy: { level: "asc" },
    });

    const referrals = await db.referral.findMany({
      include: {
        createdFor: {
          select: { id: true, name: true, email: true, phone: true },
        },
        usedByUsers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        transactions: {
          select: {
            userId: true,
            commission: true,
            price: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    const referralUsageMap: Record<string, { purchase: any[] }> = {};

    for (const ref of referrals) {
      const associateId = ref.createdFor?.id;
      if (!associateId) continue;

      const purchasesSeen = new Set();
      const uniquePurchaseUsers = [];

      for (const tx of ref.transactions) {
        if (tx.userId && !purchasesSeen.has(tx.userId)) {
          purchasesSeen.add(tx.userId);
          uniquePurchaseUsers.push(tx.user);
        }
      }

      referralUsageMap[associateId] = {
        purchase: uniquePurchaseUsers,
      };
    }

    const allAssociates = await db.associate.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    const associatesByLevel: Record<number, any[]> = {};
    for (const assoc of allAssociates) {
      if (!associatesByLevel[assoc.level]) {
        associatesByLevel[assoc.level] = [];
      }

      const usage = referralUsageMap[assoc.userId] || { purchase: [] };

      const userTransactions = referrals
        .filter((ref) => ref.createdFor?.id === assoc.userId)
        .flatMap((ref) => ref.transactions || [])
        .filter((tx) => tx.userId);

      const totalRevenue = userTransactions.reduce(
        (sum, tx) => sum + (tx.commission || 0),
        0
      );

      const commissionEarned = (assoc.percent / 100) * totalRevenue;

      associatesByLevel[assoc.level].push({
        id: assoc.id,
        associaateId: assoc.userId,
        associaateEmail: assoc.user.email,
        associaateName: assoc.user.name,
        phone: assoc.user.phone,
        level: assoc.level,
        commissionPercent: assoc.percent,
        createdAt: assoc.createdAt,
        usedByUsers: usage,
        revenue: totalRevenue,
        commissionEarned: parseFloat(commissionEarned.toFixed(2)),
      });
    }

    const buildNestedLevels = (currentLevel: number, parentId: string | null = null): any => {
      const levelData = levels.find((lvl) => lvl.level === currentLevel);
      if (!levelData) return null;

      const associates = associatesByLevel[currentLevel] || [];
      const lowerLevel = buildNestedLevels(currentLevel - 1, "nested");

      let totalLowerRevenue = 0;
      const levelWiseRevenue: Record<string, number> = {};

      if (lowerLevel?.associates?.length) {
        for (const assoc of lowerLevel.associates) {
          const assocLevel = assoc.level;
          const assocRevenue = assoc.revenue || 0;

          const key = `level${assocLevel}Revenue`;
          levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;
          totalLowerRevenue += assocRevenue;

          for (const k in assoc) {
            if (k.startsWith("level") && k.endsWith("Revenue")) {
              levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
              totalLowerRevenue += assoc[k];
            }
          }
        }
      }

      const updatedAssociates = associates.map((a) => {
        const fullRevenue = a.revenue + totalLowerRevenue;
        const isTopLevel = parentId === null;

        const commissionPercent = isTopLevel
          ? getOverriddenCommissionPercent(currentLevel) ?? levelData.percent
          : levelData.percent;

        const totalCommissionInRupee = parseFloat(
          ((commissionPercent / 100) * fullRevenue).toFixed(2)
        );

        const totalCommissionInPercent = parseFloat(
          ((totalCommissionInRupee / fullRevenue) * 100).toFixed(2)
        );

        const result: any = {
          ...a,
          ...levelWiseRevenue,
          revenueFromLowerLevels: totalLowerRevenue,
          finalRevenue: fullRevenue,
          totalCommissionInRupee,
          totalCommissionInPercent,
        };

        if (isTopLevel) {
          result.commissionPercent = commissionPercent;
          result.totalCommissionInPercent = commissionPercent;
        }

        return result;
      });

      const result: any = {
        level: currentLevel,
        percent: levelData.percent,
        associates: updatedAssociates,
      };

      if (lowerLevel) {
        result.lowerLevels = [lowerLevel];
        result.revenueShared = totalLowerRevenue;
        result.commissionDistributed = {
          [`level_${currentLevel}`]: parseFloat(
            ((levelData.percent / 100) * totalLowerRevenue).toFixed(2)
          ),
        };
      }

      return result;
    };

    const topLevels = levels
      .filter((lvl) => lvl.level >= 2)
      .map((lvl) => buildNestedLevels(lvl.level));

    return res.status(200).json({
      success: true,
      levels: topLevels,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const overriddenCommissions: Record<number, number> = {}; // key: level, value: new percent

export const updateTopLevelCommissionPercent = (req: Request, res: Response) => {
  const { level, newPercent } = req.body;

  if (typeof level !== 'number' || typeof newPercent !== 'number') {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  overriddenCommissions[level] = newPercent;

  return res.status(200).json({ success: true, message: `Commission updated for level ${level}` });
};

export const getOverriddenCommissionPercent = (level: number): number | undefined => {
  return overriddenCommissions[level];
};

export const deleteAssociateById = async (req: Request, res: Response) => {
  const { associateId } = req.body;

  if (!associateId) {
    return res.status(400).json({ success: false, message: "Associate ID is required" });
  }

  try {
    // Get related referrals created by this associate
    const referrals = await db.referral.findMany({
      where: {
        createdForId: associateId,
      },
      select: { id: true },
    });

    const referralIds = referrals.map((ref) => ref.id);

    // ✅ Use correct model name for transactions
    await db.referralTransaction.deleteMany({
      where: {
        referralId: { in: referralIds },
      },
    });

    await db.referral.deleteMany({
      where: {
        id: { in: referralIds },
      },
    });

    await db.associate.deleteMany({
      where: {
        userId: associateId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Associate and related data deleted successfully.",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, message: "Server error during deletion." });
  }
};



export const searchAssociates = async (req: Request, res: Response) => {
  try {
    const query = (req.query.name as string)?.trim();

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters.",
      });
    }

    const results = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query } },
        ],
        associate: {
          isNot: null, // Only users with associate entries
        },
      },
      include: {
        associate: true,
      },
    });

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};