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

    const buildNestedLevels = async (currentLevel: number, parentId: string | null = null): any => {
      const levelData = levels.find((lvl) => lvl.level === currentLevel);
      if (!levelData) return null;

      const associates = associatesByLevel[currentLevel] || [];
      const lowerLevel = await buildNestedLevels(currentLevel - 1, "nested");

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

 const updatedAssociates = await Promise.all(
  associates.map(async (a) => {
    const fullRevenue = a.revenue + totalLowerRevenue;
    const isTopLevel = parentId === null;

      const commissionPercent = isTopLevel
        ? (await getOverriddenCommissionPercent(a.associaateId,currentLevel)) ?? levelData.percent ?? 0
        : levelData.percent ?? 0;


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
  })
);


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

const topLevels = await Promise.all(
  levels
    .filter((lvl) => lvl.level >= 2)
    .map((lvl) => buildNestedLevels(lvl.level))
);
    return res.status(200).json({
      success: true,
      levels: topLevels,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCommissionPercent = async (req: Request, res: Response) => {
  const { associateId, level, newPercent } = req.body;

  if (
    typeof level !== 'number' ||
    typeof newPercent !== 'number' ||
    typeof associateId !== 'string'
  ) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    await db.commissionOverride.upsert({
      where: {
        associateId_level: {
          associateId,
          level,
        },
      },
      update: { newPercent },
      create: { associateId, level, newPercent },
    });

    return res.status(200).json({
      success: true,
      message: `Commission successfully updated for associate ${associateId} at level ${level}`,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: "Database update failed" });
  }
};

export const getOverriddenCommissionPercent = async (
  associateId: string,
  level: number
): Promise<number | undefined> => {
  try {
    const override = await db.commissionOverride.findUnique({
      where: {
        associateId_level: {
          associateId,
          level,
        },
      },
    });

    return override?.newPercent;
  } catch (error) {
    console.error("Override fetch error:", error);
    return undefined;
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

export const deleteAssociateById = async (req: Request, res: Response) => {
  const associateId = req.params.id;

  if (!associateId) {
    return res.status(400).json({ success: false, message: "Associate ID is required" });
  }

  try {
    // Step 1: Fetch the associate entry
    const associate = await db.associate.findUnique({
      where: { id: associateId },
      include: { user: true }, // include user data
    });

    if (!associate || !associate.user) {
      return res.status(404).json({ success: false, message: "Associate not found" });
    }

    const userId = associate.userId;

    // Step 2: Update the user role from ASSOCIATE to USER
    await db.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });

    // Step 3: Delete referrals created for this associate
    const referrals = await db.referral.findMany({
      where: { createdForId: userId },
      select: { id: true },
    });

    const referralIds = referrals.map((r) => r.id);

    if (referralIds.length > 0) {
      // Delete referral transactions
      await db.referralTransaction.deleteMany({
        where: {
          referralId: { in: referralIds },
        },
      });

      // Delete referrals
      await db.referral.deleteMany({
        where: {
          id: { in: referralIds },
        },
      });
    }

    // Step 4: Delete Associate record
    await db.associate.delete({
      where: { id: associateId },
    });

    return res.status(200).json({
      success: true,
      message: "Associate converted to user and deleted successfully.",
    });

  } catch (error) {
    console.error("Delete error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete associate. They are referenced in another table.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during associate deletion.",
    });
  }
};



